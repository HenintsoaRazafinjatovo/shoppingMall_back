const BaseModel = require('./BaseModel');
const Review = require('./Review');

class ReviewModel extends BaseModel {
  constructor() {
    super(Review);
  }

  async createReview(reviewData) {
    const { userId, productId, rating, comment = '' } = reviewData;

    return await this.create({ userId, productId, rating, comment });
  }

  async updateReview(reviewId, updates) {
    return await this.updateById(reviewId, updates);
  }

  async deleteReview(reviewId) {
    return await this.softDelete(reviewId);
  }
}

module.exports = ReviewModel;
