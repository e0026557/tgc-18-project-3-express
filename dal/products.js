// *** DEPENDENCIES ***
const {
	FountainPen,
	Property,
	FillingMechanism,
	Brand,
	CapType,
	SaleStatus,
	Color,
	NibFlexibility,
	NibSize,
	NibShape,
	NibMaterial,
	Variant
} = require('../models');

// *** FUNCTIONS ***
const getAllProducts = async function () {
	const products = await FountainPen.collection().fetch({
		withRelated: [
			'brand',
			'capType',
			'variants',
			'properties',
			'fillingMechanisms',
			'saleStatus',
			'variants.color',
			'variants.nibFlexibility',
			'variants.nibSize',
			'variants.nibShape',
			'variants.nibMaterial'
		]
	});
	return products;
};

const getAllProperties = async function () {
	const properties = await Property.fetchAll().map((property) => {
		return [property.get('id'), property.get('property')];
	});

	return properties;
};

const getAllFillingMechanisms = async function () {
	const fillingMechanisms = await FillingMechanism.fetchAll().map(
		(fillingMechanism) => {
			return [
				fillingMechanism.get('id'),
				fillingMechanism.get('filling_mechanism')
			];
		}
	);

	return fillingMechanisms;
};

const getAllBrands = async function () {
	const brands = await Brand.fetchAll().map((brand) => {
		return [brand.get('id'), brand.get('brand')];
	});

	return brands;
};

const getAllCapTypes = async function () {
	const capTypes = await CapType.fetchAll().map((capType) => {
		return [capType.get('id'), capType.get('cap_type')];
	});

	return capTypes;
};

const getAllSaleStatuses = async function () {
	const saleStatuses = await SaleStatus.fetchAll().map((saleStatus) => {
		return [saleStatus.get('id'), saleStatus.get('sale_status')];
	});

	return saleStatuses;
};

const getAllColors = async function () {
	const colors = await Color.fetchAll().map((color) => {
		return [color.get('id'), color.get('color')];
	});

	return colors;
};

const getAllNibFlexibilities = async function () {
	const nibFlexibilities = await NibFlexibility.fetchAll().map((flex) => {
		return [flex.get('id'), flex.get('nib_flexibility')];
	});

	return nibFlexibilities;
};

const getAllNibSizes = async function () {
	const sizes = await NibSize.fetchAll().map((size) => {
		return [size.get('id'), size.get('nib_size')];
	});

	return sizes;
};

const getAllNibShapes = async function () {
	const shapes = await NibShape.fetchAll().map((shape) => {
		return [shape.get('id'), shape.get('nib_shape')];
	});

	return shapes;
};

const getAllNibMaterials = async function () {
	const materials = await NibMaterial.fetchAll().map((material) => {
		return [material.get('id'), material.get('nib_material')];
	});

	return materials;
};

const getAllProductFormChoices = async function () {
	const brands = await getAllBrands();
	const capTypes = await getAllCapTypes();
	const properties = await getAllProperties();
	const fillingMechanisms = await getAllFillingMechanisms();
	const saleStatuses = await getAllSaleStatuses();

	return {
		brands,
		capTypes,
		properties,
		fillingMechanisms,
		saleStatuses
	};
};

const getAllVariantFormChoices = async function () {
	const nibMaterials = await getAllNibMaterials();
	const nibFlexibilities = await getAllNibFlexibilities();
	const nibSizes = await getAllNibSizes();
	const nibShapes = await getAllNibShapes();
	const colors = await getAllColors();

	return {
		nibFlexibilities,
		nibMaterials,
		nibShapes,
		nibSizes,
		colors
	};
};

const getProductById = async function (productId) {
	try {
		const product = await FountainPen.where({
			id: productId
		}).fetch({
			withRelated: [
				'brand',
				'capType',
				'variants',
				'properties',
				'fillingMechanisms',
				'saleStatus',
				'variants.color',
				'variants.nibFlexibility',
				'variants.nibSize',
				'variants.nibShape',
				'variants.nibMaterial'
			],
			require: true
		});

		return product;
	} catch (error) {
		return false;
	}
};

const getVariantsByProductId = async function (productId) {
	try {
		const variants = await Variant.collection()
			.where({
				fountain_pen_id: productId
			})
			.fetch({
				require: true,
				withRelated: [
					'nibMaterial',
					'nibShape',
					'nibSize',
					'nibFlexibility',
					'color'
				]
			});

		return variants;
	} catch (error) {
		return false;
	}
};

const getVariantById = async function (variantId) {
	const variant = await Variant.where({
		id: variantId
	}).fetch({
		require: true,
		withRelated: [
			'nibMaterial',
			'nibShape',
			'nibSize',
			'nibFlexibility',
			'color'
		]
	});

	return variant;
};

const addProduct = async function (formData) {
	// Extract product data from form data
	const { properties, fillingMechanisms, ...productData } = formData;

	const product = new FountainPen(productData);
	await product.save();

	// Attach m:m relationships
	if (properties) {
		await product.properties().attach(properties.split(','));
	}

	if (fillingMechanisms) {
		await product.fillingMechanisms().attach(fillingMechanisms.split(','));
	}

	return product;
};

const updateProduct = async function (productId, formData) {
	// Get product by ID
	const product = await getProductById(productId);

	// If product does not exist, return
	if (!product) {
		return false; // Indicate failure
	}

	// Separate product data from form data
	const { fillingMechanisms, properties, ...productData } = formData;

	// Populate product with new data
	product.set(productData);
	await product.save();

	// Update m:m relationships
	let selectedFillingMechanismIds = fillingMechanisms
		.split(',')
		.map((id) => parseInt(id));
	let currentFillingMechanismIds = await product
		.related('fillingMechanisms')
		.pluck('id'); // Get id of all filling mechanisms associated with the product

	let fillingMechanismIdsToRemove = currentFillingMechanismIds.filter(
		(id) => !selectedFillingMechanismIds.includes(id)
	); // Get id of filling mechanisms that were no longer selected
	await product.fillingMechanisms().detach(fillingMechanismIdsToRemove);

	await product.fillingMechanisms().attach(selectedFillingMechanismIds);

	let selectedPropertyIds = properties.split(',').map((id) => parseInt(id));
	let currentPropertyIds = await product.related('properties').pluck('id'); // Get id of all properties associated with the product

	let propertyIdsToRemove = currentPropertyIds.filter(
		(id) => !selectedPropertyIds.includes(id)
	); // Get id of all properties that are no longer selected
	await product.properties().detach(propertyIdsToRemove);

	await product.properties().attach(selectedPropertyIds);

	return true; // Indicate success
};

const deleteProduct = async function (productId) {
	// Check that product to be deleted exists and has no variants
	const product = await getProductById(productId);

	if (!product || product.toJSON().variants.length > 0) {
		return;
	}

	await product.destroy();
	return true; // Indicate success
};

const addVariant = async function (formData) {
	const variant = new Variant(formData);
	await variant.save();

	return variant;
};

const updateVariant = async function (variantId, formData) {
	// Get variant to be updated
	const variant = await getVariantById(variantId);

	if (!variant) {
		return;
	}

	// Populate variant with new data
	variant.set(formData);
	await variant.save();

	return true; // Indicate success
};

const deleteVariant = async function (variantId) {
	// Check that variant to be deleted exists
	const variant = await getVariantById(variantId);

	if (!variant) {
		return;
	}

	await variant.destroy();
	return true;
};

const filterProductsBySearchFields = async function (form) {
	// Create query builder
	let query = FountainPen.collection();

	if (form.data.brand_id && form.data.brand_id != 0) {
		query.where('brand_id', '=', form.data.brand_id);
	}

	if (form.data.model) {
		// MySQL syntax (case insensitive by default)
		if (process.env.DB_DRIVER == 'mysql') {
			query.where('model', 'like', `%${form.data.model}%`);
		} else {
			query.where('model', 'ilike', `%${form.data.model}%`);
		}
	}

	if (form.data.sale_status_id && form.data.sale_status_id != 0) {
		query.where('sale_status_id', '=', form.data.sale_status_id);
	}

	if (form.data.cap_type_id && form.data.cap_type_id != 0) {
		query.where('cap_type_id', '=', form.data.cap_type_id);
	}

	if (form.data.fillingMechanisms) {
		query
			.query(
				'join',
				'filling_mechanisms_fountain_pens',
				'fountain_pens.id',
				'fountain_pen_id'
			)
			.where(
				'filling_mechanism_id',
				'in',
				form.data.fillingMechanisms.split(',')
			);
	}

	let products = (
		await query.fetch({
			withRelated: [
				'brand',
				'capType',
				'variants',
				'properties',
				'fillingMechanisms',
				'saleStatus'
			]
		})
	).toJSON();

	return products;
};

const searchProducts = async function (searchFields) {
	// Create query builder
	let query = FountainPen.collection().query('join', 'variants', 'fountain_pen_id', 'fountain_pens.id');

	// Search criteria:
	// brand (id), model (text), filling mechanism (id), cap type (id), properties (id)
	// min/max cost, nib material (id), nib size (id), nib shape (id), nib flexibility (id), color (id)

	// Product search
	if (searchFields.brand_id && searchFields.brand_id != 0) {
		query.where('brand_id', '=', searchFields.brand_id);
	}

	if (searchFields.model) {
		// MySQL syntax (case insensitive by default)
		if (process.env.DB_DRIVER == 'mysql') {
			query.where('model', 'like', `%${searchFields.model}%`);
		} else {
			query.where('model', 'ilike', `%${searchFields.model}%`);
		}
	}

	if (searchFields.filling_mechanisms) {
		query
			.query(
				'join',
				'filling_mechanisms_fountain_pens',
				'fountain_pens.id',
				'fountain_pen_id'
			)
			.where(
				'filling_mechanism_id',
				'in',
				searchFields.filling_mechanisms.split(',')
			);
	}

	if (searchFields.cap_type_id && searchFields.cap_type_id != 0) {
		query.where('cap_type_id', '=', searchFields.cap_type_id);
	}

	if (searchFields.properties) {
		query
			.query(
				'join',
				'fountain_pens_properties',
				'fountain_pens.id',
				'fountain_pen_id'
			)
			.where(
				'property_id',
				'in',
				searchFields.properties.split(',')
			);
	}

	// Variant search
	if (searchFields.min_cost) {
		query.where('cost', '>=', searchFields.min_cost);
	}

	if (searchFields.max_cost) {
		query.where('cost', '<=', searchFields.max_cost);
	}


	if (searchFields.nib_material_id && searchFields.nib_material_id != 0) {
		query.where('nib_material_id', '=', searchFields.nib_material_id);
	}

	if (searchFields.nib_shape_id && searchFields.nib_shape_id != 0) {
		query.where('nib_shape_id', '=', searchFields.nib_shape_id);
	}

	if (searchFields.nib_size_id && searchFields.nib_size_id != 0) {
		query.where('nib_size_id', '=', searchFields.nib_size_id);
	}

	if (searchFields.nib_flexibility_id && searchFields.nib_flexibility_id != 0) {
		query.where('nib_flexibility_id', '=', searchFields.nib_flexibility_id);
	}

	if (searchFields.color_id && searchFields.color_id != 0) {
		query.where('color_id', '=', searchFields.color_id);
	}

	let products = (
		await query.fetch({
			withRelated: [
				'brand',
				'capType',
				'variants',
				'properties',
				'fillingMechanisms',
				'saleStatus',
				'variants.color',
				'variants.nibFlexibility',
				'variants.nibSize',
				'variants.nibShape',
				'variants.nibMaterial'
			]
		})
	).toJSON();

	return products;
}

module.exports = {
	getAllProperties,
	getAllFillingMechanisms,
	getAllBrands,
	getAllCapTypes,
	getAllSaleStatuses,
	getAllColors,
	getAllNibFlexibilities,
	getAllNibSizes,
	getAllNibShapes,
	getAllNibMaterials,
	getAllProductFormChoices,
	getAllVariantFormChoices,
	getAllProducts,
	getProductById,
	getVariantsByProductId,
	getVariantById,
	addProduct,
	updateProduct,
	deleteProduct,
	addVariant,
	updateVariant,
	deleteVariant,
	filterProductsBySearchFields,
	searchProducts
};
