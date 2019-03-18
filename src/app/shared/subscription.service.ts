import { Injectable } from '@angular/core';

@Injectable()
export class SubscriptionService {
    private isRecommendationsPresent = true;

    clearRecommendations() {
        this.isRecommendationsPresent = false;
    }

    getIsRecommendationsPresent() {
        return this.isRecommendationsPresent;
    }
}
