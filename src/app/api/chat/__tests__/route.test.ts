import { POST } from '../route';
import OpenAI from 'openai';

jest.mock('openai');

const createMockRequest = (body: any) => {
  return {
    json: () => Promise.resolve(body),
  } as unknown as Request;
};

describe('/api/chat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a message from OpenAI', async () => {
    const mockMessage = 'Hello from AI!';
    (OpenAI.prototype.chat = {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: mockMessage } }],
        }),
      },
    } as any);
    const request = createMockRequest({ message: 'Hi!' });
    const response = await POST(request);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toEqual({ message: mockMessage });
  });

  it('should return 500 if OpenAI call fails', async () => {
    (OpenAI.prototype.chat = {
      completions: {
        create: jest.fn().mockRejectedValue(new Error('OpenAI error')),
      },
    } as any);
    const request = createMockRequest({ message: 'Hi!' });
    const response = await POST(request);
    const data = await response.json();
    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
  });
}); 