import { describe, it, expect, vi, beforeEach } from 'vitest';
// TODO: Consider using msw for more robust API mocking in future tests

type RequestHandler = (config: { headers?: Record<string, string> }) => { headers?: Record<string, string> };
type ResponseErrorHandler = (error: unknown) => Promise<never>;

let requestHandler: RequestHandler = config => config;
let responseErrorHandler: ResponseErrorHandler = error => Promise.reject(error);

const httpMock = {
  get: vi.fn(),
  post: vi.fn(),
  interceptors: {
    request: {
      use: vi.fn((handler: RequestHandler) => {
        requestHandler = handler;
        return 0;
      }),
    },
    response: {
      use: vi.fn((_ok: unknown, onError: ResponseErrorHandler) => {
        responseErrorHandler = onError;
        return 0;
      }),
    },
  },
};

const axiosCreate = vi.fn(() => httpMock);
const axiosIsAxiosError = vi.fn((error: unknown) => Boolean((error as { isAxiosError?: boolean })?.isAxiosError));

vi.mock('axios', () => ({
  default: {
    create: axiosCreate,
    isAxiosError: axiosIsAxiosError,
  },
  create: axiosCreate,
  isAxiosError: axiosIsAxiosError,
}));

async function loadApi() {
  vi.resetModules();
  const mod = await import('@/lib/api-client');
  return mod.api;
}

describe('api-client', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    requestHandler = config => config;
    responseErrorHandler = error => Promise.reject(error);
    window.history.pushState({}, '', '/');
  });

  it('adds Authorization header in request interceptor when token exists', async () => {
    localStorage.setItem('faas_token', 'abc123');
    await loadApi();

    const config = requestHandler({ headers: {} });

    expect(config.headers?.Authorization).toBe('Bearer abc123');
  });

  it('clears token and redirects on 401 outside auth routes', async () => {
    localStorage.setItem('faas_token', 'abc123');
    window.history.pushState({}, '', '/dashboard');
    await loadApi();

    const err = { isAxiosError: true, response: { status: 401 } };
    await expect(responseErrorHandler(err)).rejects.toEqual(err);

    expect(localStorage.getItem('faas_token')).toBeNull();
  });

  it('does not clear token on 401 when already on auth route', async () => {
    localStorage.setItem('faas_token', 'abc123');
    window.history.pushState({}, '', '/login');
    await loadApi();

    const err = { isAxiosError: true, response: { status: 401 } };
    await expect(responseErrorHandler(err)).rejects.toEqual(err);

    expect(localStorage.getItem('faas_token')).toBe('abc123');
  });

  it('ready returns true for 200 and false on failure', async () => {
    const api = await loadApi();

    httpMock.get.mockResolvedValueOnce({ status: 200 });
    await expect(api.ready()).resolves.toBe(true);

    httpMock.get.mockRejectedValueOnce(new Error('network'));
    await expect(api.ready()).resolves.toBe(false);
  });

  it('inspectByName throws when deployment is missing', async () => {
    const api = await loadApi();
    httpMock.get.mockResolvedValueOnce({ data: [{ suffix: 'existing' }] });

    await expect(api.inspectByName('missing')).rejects.toThrow('Deployment "missing" not found');
  });

  it('login surfaces backend error message', async () => {
    const api = await loadApi();
    httpMock.post.mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        data: { error: 'Invalid credentials' },
      },
    });

    await expect(api.login('a@b.com', 'bad-pass')).rejects.toThrow('Invalid credentials');
  });
});