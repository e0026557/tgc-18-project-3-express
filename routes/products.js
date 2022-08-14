//  *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();

const dataLayer = require('../dal/products');
const {
  createProductForm,
  bootstrapField,
  createVariantForm
} = require('../forms');
const { FountainPen, Variant } = require('../models');

// *** ROUTES ***

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
        totalStock: product.variants
          .map((obj) => obj.stock)
          .reduce((prev, curr) => prev + curr),
        // Calculate max price
        maxPrice: Math.max(
          ...product.variants.map((obj) => parseInt(obj.cost))
        ),
        // Calculate min price
        minPrice: Math.min(
          ...product.variants.map((obj) => parseInt(obj.cost))
        )
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
      // Extract product data from form data
      const { properties, fillingMechanisms, ...productData } = form.data;

      const product = new FountainPen(productData);
      const newProduct = (await product.save()).toJSON();

      // Attach m:m relationships
      if (properties) {
        await product.properties().attach(properties.split(','));
      }

      if (fillingMechanisms) {
        await product
          .fillingMechanisms()
          .attach(fillingMechanisms.split(','));
      }

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

// TODO
router.get('/:product_id/variants', async function (req, res) {
  const product = (
    await dataLayer.getProductById(req.params.product_id)
  ).toJSON();

  const variants = (await dataLayer.getVariantsByProductId(req.params.product_id)).toJSON();

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
      const variant = new Variant(form.data);
      variant.set('fountain_pen_id', parseInt(req.params.product_id));

      await variant.save();

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
})

module.exports = router;
