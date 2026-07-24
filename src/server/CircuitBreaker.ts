export enum CircuitState {
  CLOSED,
  OPEN,
  HALF_OPEN
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private nextAttempt: number = Date.now();
  
  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;

  constructor(failureThreshold = 3, resetTimeoutMs = 30000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeoutMs = resetTimeoutMs;
  }

  public async fire<T>(action: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() > this.nextAttempt) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        throw new Error('AI_SERVICE_DEGRADED');
      }
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (error: any) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
  }

  private onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = CircuitState.OPEN;
      this.nextAttempt = Date.now() + this.resetTimeoutMs;
    }
  }
}
