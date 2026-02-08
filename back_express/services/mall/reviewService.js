const Review = require('../../models/ReviewModel');

class ReviewService {
  constructor() {
    this.reviewModel = new Review();
  }

  async addReview(data) {
    try {
      return await this.reviewModel.create(data);
    } catch (error) {
      throw new Error(`Error adding review: ${error.message}`);
    }
  }

  async getReviewsByProduct(productId) {
    try {
      return await this.reviewModel.findAll({ productId });
    } catch (error) {
      throw new Error(`Error fetching reviews: ${error.message}`);
    }
  }
  async addReview(data) {
  try {
    return await this.reviewModel.create(data);
  } catch (error) {
    throw new Error(`Error adding review: ${error.message}`);
  }
}

}

module.exports = ReviewService;
