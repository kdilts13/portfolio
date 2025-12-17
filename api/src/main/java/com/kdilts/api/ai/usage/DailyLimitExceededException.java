package com.kdilts.api.ai.usage;

public class DailyLimitExceededException extends RuntimeException {
    private final int limit;

    public DailyLimitExceededException(int limit) {
        super("Daily limit exceeded");
        this.limit = limit;
    }

    public int getLimit() {
        return limit;
    }
}
