import { Injectable } from '@angular/core';
import { AuthService } from '../auth/shared/auth.service';

@Injectable()
export class SubscriptionService {
    constructor(private authService: AuthService) {
    }
    private isRecommendationsPresent = this.authService.getLoginCount() > 2 ? false : true;

    clearRecommendations() {
        this.isRecommendationsPresent = false;
    }

    getIsRecommendationsPresent() {
        return this.isRecommendationsPresent;
    }
}
