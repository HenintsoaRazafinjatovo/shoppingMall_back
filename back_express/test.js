require('dotenv').config();
const connectDB = require('./config/database');
const UserModel = require('./models/UserModel');
const CategoryModel = require('./models/CategoryModel');
const BoutiqueModel = require('./models/BoutiqueModel');
const ProductModel = require('./models/ProductModel');

async function testInsert() {
  try {
    // 1️⃣ Connexion à MongoDB
    await connectDB();
    console.log("Connexion à MongoDB réussie");

    // 2️⃣ Insertion utilisateur
    const userData = {
      fullName: "Admin Central",
      email: "admin2@mall.com",
      password: "admin1234",
      role: "ADMIN_CENTRE",
      phone: "0340000000",
      profilePicturePath: "/images/user/admin.png"
    };

    const user = await UserModel.createUser(userData);
    console.log("Utilisateur inséré :", user.email);

    // 3️⃣ Insertion catégorie
    const categoryData = { name: "Techn" };
    const category = await CategoryModel.createCategory(categoryData);
    console.log("Catégorie insérée :", category.name);

    //4️⃣ Insertion boutique
    const boutiqueData = {
      name: "SportWorldIN",
      description: "Boutique de sport",
      logo: "/images/boutique/sport.png",
      ownerId: user._id,
      isValidated: true
    };
    const boutique = await BoutiqueModel.createBoutique(boutiqueData);
    console.log("Boutique insérée :", boutique.name);

    // 5️⃣ Insertion produit
    const productData = {
      name: "Nike Air Max 90",
      description: "Chaussure running",
      price: 250000,
      images: ["/images/products/airmax.jpg"],
      categoryId: category._id,
      boutiqueId: boutique._id,
      isActive: true
    };
    const product = await ProductModel.createProduct(productData);
    console.log("Produit inséré :", product.name);

    // 6️⃣ Fermer la connexion MongoDB proprement
    console.log("Insertion terminée avec succès !");
    process.exit(0);

  } catch (err) {
    console.error("Erreur lors de l'insertion :", err.message);
    process.exit(1);
  }
}

testInsert();
