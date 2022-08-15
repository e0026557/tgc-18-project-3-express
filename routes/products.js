//  *** DEPENDENCIES ***
const express = require('express');
const router = express.Router();

const dataLayer = require('../dal/products');
const {
  createProductForm,
  bootstrapField,
  createVariantForm,
  createSearchForm
} = require('../forms');

// *** FUNCTIONS ***
function formatProductData(products) {
  return products.map((product) => {
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
}

// *** ROUTES ***

// --- Products ---

router.get('/', async function (req, res) {
  // Get all fields required for search form
  const brands = await dataLayer.getAllBrands();
  brands.unshift([0, '--- Any Brand ---']);

  const fillingMechanisms = await dataLayer.getAllFillingMechanisms();

  const capTypes = await dataLayer.getAllCapTypes();
  capTypes.unshift([0, '--- Any Cap Type ---']);

  const saleStatuses = await dataLayer.getAllSaleStatuses();
  saleStatuses.unshift([0, '--- Any Sale Status ---']);

  const choices = {
    brands,
    fillingMechanisms,
    capTypes,
    saleStatuses
  };

  // Create search form
  const searchForm = createSearchForm(choices);

  searchForm.handle(req, {
    success: async function (form) {
      // Get filtered products based on search form data (except stock which is derived field)
      let products = await dataLayer.filterProductsBySearchFields(form);

      // Format product data
      products = formatProductData(products);

      // Filter products by total stock (derived value)
      if (form.data.min_stock) {
        products = products.filter(product => product.totalStock >= form.data.min_stock);
      }

      if (form.data.max_stock) {
        products = products.filter(product => product.totalStock <= form.data.max_stock);
      }

      res.render('products/index', {
        products: products,
        form: form.toHTML(bootstrapField)
      });
    },
    error: async function (form) {
      // Get all products
      let products = (await dataLayer.getAllProducts()).toJSON();
      products = formatProductData(products);

      res.render('products/index', {
        products: products,
        form: form.toHTML(bootstrapField)
      });
    },
    empty: async function (form) {
      // Get all products
      let products = (await dataLayer.getAllProducts()).toJSON();
      products = formatProductData(products);

      res.render('products/index', {
        products: products,
        form: form.toHTML(bootstrapField)
      });
    }
  });

  // OLD CODE (PRIOR TO SEARCH ENGINE)
  // // Fetch all products and convert to JSON format
  // let products = (await dataLayer.getAllProducts()).toJSON();

  // // Format products for displaying in dashboard
  // // Exception may be thrown when there is a product with no variants
  // try {
  //   // products = products.map((product) => {
  //   //   return {
  //   //     ...product,
  //   //     // Extract only filling mechanism
  //   //     fillingMechanisms: product.fillingMechanisms.map(
  //   //       (obj) => obj.filling_mechanism
  //   //     ),
  //   //     // Calculate total stock
  //   //     totalStock: product.variants.length ? product.variants
  //   //       .map((obj) => obj.stock)
  //   //       .reduce((prev, curr) => prev + curr) : 0,
  //   //     // Calculate max price
  //   //     maxPrice: product.variants.length ? Math.max(
  //   //       ...product.variants.map((obj) => parseInt(obj.cost))
  //   //     ) : 0,
  //   //     // Calculate min price
  //   //     minPrice: product.variants.length ? Math.min(
  //   //       ...product.variants.map((obj) => parseInt(obj.cost))
  //   //     ) : 0
  //   //   };
  //   // });
  //   products = formatProductData(products);
  // } catch (error) {
  //   console.log(error);
  //   products = [];
  // }

  // // console.log(products);
  // res.render('products/index', {
  //   products: products,
  //   form: searchForm.toHTML(bootstrapField)
  // });
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

router.get('/:product_id/update', async function (req, res) {
  // Get product to be updated
  const product = await dataLayer.getProductById(req.params.product_id);

  // Fetch all choices for product form
  const choices = await dataLayer.getAllProductFormChoices();

  // Create product form and populate with existing data
  const productForm = createProductForm(choices, 'update');

  productForm.fields.brand_id.value = product.get('brand_id');
  productForm.fields.model.value = product.get('model');
  productForm.fields.length.value = product.get('length');
  productForm.fields.diameter.value = product.get('diameter');
  productForm.fields.weight.value = product.get('weight');
  productForm.fields.cap_type_id.value = product.get('cap_type_id');
  productForm.fields.description.value = product.get('description');
  productForm.fields.sale_status_id.value = product.get('sale_status_id');
  productForm.fields.image_url.value = product.get('image_url');
  productForm.fields.thumbnail_url.value = product.get('thumbnail_url');

  // Filling mechanisms
  let selectedFillingMechanisms = await product.related('fillingMechanisms').pluck('id');
  productForm.fields.fillingMechanisms.value = selectedFillingMechanisms;

  // Properties
  let selectedProperties = await product.related('properties').pluck('id');
  productForm.fields.properties.value = selectedProperties;

  res.render('products/update', {
    product: product.toJSON(),
    form: productForm.toHTML(bootstrapField)
  });
});

router.post('/:product_id/update', async function (req, res) {
  // Get product to be updated
  const product = await dataLayer.getProductById(req.params.product_id);

  // Fetch all choices for product form
  const choices = await dataLayer.getAllProductFormChoices();

  // Process product form
  const productForm = createProductForm(choices, 'update');
  productForm.handle(req, {
    success: async function (form) {
      const result = await dataLayer.updateProduct(req.params.product_id, form.data);

      if (!result) {
        req.flash('error_messages', 'An error occurred when updating. Please try again');
      }
      else {
        req.flash('success_messages', 'Product successfully updated');
      }

      res.redirect('/products');
    },
    error: function (form) {
      res.render('products/update', {
        product: product.toJSON(),
        form: form.toHTML(bootstrapField)
      });
    },
    empty: function (form) {
      res.render('products/update', {
        product: product.toJSON(),
        form: form.toHTML(bootstrapField)
      });
    }
  })
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

router.get('/:product_id/variants/:variant_id/update', async function (req, res) {
  // Get variant to be updated
  const variant = await dataLayer.getVariantById(req.params.variant_id);

  // Get choices for variant form
  const choices = await dataLayer.getAllVariantFormChoices();

  // Create variant form and populate with existing data
  const variantForm = createVariantForm(choices);

  variantForm.fields.nib_size_id.value = variant.get('nib_size_id');
  variantForm.fields.nib_shape_id.value = variant.get('nib_shape_id');
  variantForm.fields.nib_flexibility_id.value = variant.get('nib_flexibility_id');
  variantForm.fields.nib_material_id.value = variant.get('nib_material_id');
  variantForm.fields.color_id.value = variant.get('color_id');
  variantForm.fields.cost.value = variant.get('cost');
  variantForm.fields.stock.value = variant.get('stock');
  variantForm.fields.image_url.value = variant.get('image_url');
  variantForm.fields.thumbnail_url.value = variant.get('thumbnail_url');

  res.render('products/update-variant', {
    variant: variant.toJSON(),
    form: variantForm.toHTML(bootstrapField)
  });
});

router.post('/:product_id/variants/:variant_id/update', async function (req, res) {
  // Get variant to be updated
  const variant = await dataLayer.getVariantById(req.params.variant_id);

  // Get choices for variant form
  const choices = await dataLayer.getAllVariantFormChoices();

  // Process variant form
  const variantForm = createVariantForm(choices);
  variantForm.handle(req, {
    success: async function (form) {
      const result = await dataLayer.updateVariant(req.params.variant_id, form.data);

      if (!result) {
        req.flash('error_messages', 'An error occurred when updating. Please try again');
      }
      else {
        req.flash('success_messages', 'Variant successfully updated');
      }

      res.redirect(`/products/${req.params.product_id}/variants`);
    },
    error: function (form) {
      res.render('products/update-variant', {
        variant: variant.toJSON(),
        form: form.toHTML(bootstrapField)
      });
    },
    empty: function (form) {
      res.render('products/update-variant', {
        variant: variant.toJSON(),
        form: form.toHTML(bootstrapField)
      });
    }
  })
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
