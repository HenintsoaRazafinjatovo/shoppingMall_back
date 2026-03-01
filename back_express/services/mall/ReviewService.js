const ReviewModel = require('../../models/ReviewModel');

class ReviewService {
  constructor() {
    this.reviewModel = new ReviewModel();
  }

  async addReview(data) {
    try {
      return await this.reviewModel.create(data);
    } catch (error) {
      throw error;
    }
  }

  async getReviewsByProduct(productId) {
    try {
      return await this.reviewModel.findByProduct(productId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ReviewService;
