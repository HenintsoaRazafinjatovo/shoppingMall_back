const ReviewService = require('../../services/mall/reviewService');

class ReviewController {
  constructor() {
    this.reviewService = new ReviewService();
  }

  addReview = async (req, res) => {
    try {
      const review = await this.reviewService.addReview(req.body);
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getReviewsByProduct = async (req, res) => {
    try {
      const reviews = await this.reviewService.getReviewsByProduct(req.params.productId);
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

module.exports = ReviewController;
