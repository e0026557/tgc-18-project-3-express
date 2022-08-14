//  *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();

const dataLayer = require('../dal/products');
const {
  createProductForm,
  bootstrapField,
  createVariantForm
} = require('../forms');
// const { FountainPen, Variant } = require('../models');

// *** ROUTES ***

// --- Products ---

router.get('/', async function (req, res) {
  // Fetch all products and convert to JSON format
  let products = (await dataLayer.getAllProducts()).toJSON();

  // Format products for displaying in dashboard
  // Exception may be thrown when there is a product with no variants
  try {
    products = products.map((product) => {
      return {
        ...product,
        // Extract only filling mechanism
        fillingMechanisms: product.fillingMechanisms.map(
          (obj) => obj.filling_mechanism
        ),
        // Calculate total stock
        totalStock: product.variants.length ? product.variants
          .map((obj) => obj.stock)
          .reduce((prev, curr) => prev + curr) : 0,
        // Calculate max price
        maxPrice: product.variants.length ? Math.max(
          ...product.variants.map((obj) => parseInt(obj.cost))
        ) : 0,
        // Calculate min price
        minPrice: product.variants.length ? Math.min(
          ...product.variants.map((obj) => parseInt(obj.cost))
        ) : 0
      };
    });
  } catch (error) {
    console.log(error);
    products = [];
  }

  // console.log(products);
  res.render('products/index', {
    products: products
  });
});

router.get('/create', async function (req, res) {
  // Fetch all choices for product form
  const choices = await dataLayer.getAllProductFormChoices();

  const productForm = createProductForm(choices);

  res.render('products/create', {
    form: productForm.toHTML(bootstrapField)
  });
});

router.post('/create', async function (req, res) {
  // Fetch all choices for product form
  const choices = await dataLayer.getAllProductFormChoices();

  const productForm = createProductForm(choices);

  // Handle product form
  productForm.handle(req, {
    success: async function (form) {
      // Create new product
      const newProduct = await dataLayer.addProduct(form.data);

      req.flash('success_messages', 'New product added successfully');
      res.redirect(`/products/${newProduct.id}/variants/create`);
    },
    error: async function (form) {
      res.render('products/create', {
        form: form.toHTML(bootstrapField)
      });
    },
    empty: async function (form) {
      res.render('products/create', {
        form: form.toHTML(bootstrapField)
      });
    }
  });
});

router.post('/:product_id/delete', async function (req, res) {
  const result = await dataLayer.deleteProduct(req.params.product_id);

  if (result) {
    req.flash('success_messages', 'Product successfully deleted');
  } else {
    req.flash(
      'error_messages',
      'An error occurred when deleting. Please try again'
    );
  }

  res.redirect('/products');
});

// --- Variants ---

router.get('/:product_id/variants', async function (req, res) {
  const product = (
    await dataLayer.getProductById(req.params.product_id)
  ).toJSON();

  let variants = await dataLayer.getVariantsByProductId(req.params.product_id);

  if (variants) {
    variants = variants.toJSON();
  }
  else {
    variants = [];
  }

  // console.log(product);
  res.render('products/variants', {
    product: product,
    variants: variants
  });
});

router.get('/:product_id/variants/create', async function (req, res) {
  // Fetch all choices for variant form
  const choices = await dataLayer.getAllVariantFormChoices();

  const variantForm = createVariantForm(choices);
  res.render('products/create-variant', {
    form: variantForm.toHTML(bootstrapField)
  });
});

router.post('/:product_id/variants/create', async function (req, res) {
  // Fetch all choices for variant form
  const choices = await dataLayer.getAllVariantFormChoices();

  const variantForm = createVariantForm(choices);

  // Handle variant form
  variantForm.handle(req, {
    success: async function (form) {
      // Collate variant data
      const variantData = {
        ...form.data,
        fountain_pen_id: req.params.product_id
      };

      // Create new variant
      await dataLayer.addVariant(variantData);

      req.flash('success_messages', 'New variant added successfully');
      res.redirect('/products');
    },
    error: function (form) {
      res.render('products/create-variant', {
        form: form.toHTML(bootstrapField)
      });
    },
    empty: function (form) {
      res.render('products/create-variant', {
        form: form.toHTML(bootstrapField)
      });
    }
  });
});

router.post('/:product_id/variants/:variant_id/delete', async function (req, res) {
  const result = await dataLayer.deleteVariant(req.params.variant_id);

  if (result) {
    req.flash('success_messages', 'Variant successfully deleted');
  }
  else {
    req.flash('error_messages', 'An error occurred when deleting. Please try again');
  }

  res.redirect(`/products/${req.params.product_id}/variants`);
})

module.exports = router;
