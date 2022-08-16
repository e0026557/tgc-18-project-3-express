// *** DEPENDENCIES ***
const forms = require('forms');

// *** SETUP ***
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

const options = {
	validatePastFirstError: true
};

// Allow of styling of forms using Bootstrap
const bootstrapField = function (name, object) {
	if (!Array.isArray(object.widget.classes)) {
		object.widget.classes = [];
	}

	// Additional condition for allowing multiple checkbox and radio
	if (
		object.widget.type == 'multipleCheckbox' ||
		object.widget.type == 'multipleRadio'
	) {
		object.widget.classes.push('form-check-input');
	} else {
		if (object.widget.classes.indexOf('form-control') === -1) {
			object.widget.classes.push('form-control');
		}
	}

	var validationclass = object.value && !object.error ? 'is-valid' : '';
	validationclass = object.error ? 'is-invalid' : validationclass;
	if (validationclass) {
		object.widget.classes.push(validationclass);
	}

	var label = object.labelHTML(name);
	var error = object.error
		? '<div class="invalid-feedback">' + object.error + '</div>'
		: '';

	var widget = object.widget.toHTML(name, object);
	return '<div class="form-group">' + label + widget + error + '</div>';
};

// *** FORMS ***

// Attributes of product
// -> brands, properties, fillingMechanisms, capTypes, saleStatus (default is active)
const createProductForm = (choices, formType = 'create') => {
	const formFields = {
		brand_id: fields.string({
			label: 'Brand',
			required: true,
			errorAfterField: true,
			choices: choices.brands,
			widget: widgets.select()
		}),
		model: fields.string({
			required: true,
			errorAfterField: true,
			validators: [validators.maxlength(100)]
		}),
		length: fields.number({
			label: 'Length (mm)',
			required: true,
			errorAfterField: true,
			validators: [
				validators.integer(),
				validators.min(0),
				validators.max(65535)
			]
		}),
		diameter: fields.number({
			label: 'Diameter (mm)',
			required: true,
			errorAfterField: true,
			validators: [
				validators.integer(),
				validators.min(0),
				validators.max(65535)
			]
		}),
		weight: fields.number({
			label: 'Weight (g)',
			required: true,
			errorAfterField: true,
			validators: [
				validators.integer(),
				validators.min(0),
				validators.max(65535)
			]
		}),
		cap_type_id: fields.string({
			label: 'Cap Type',
			required: true,
			errorAfterField: true,
			choices: choices.capTypes,
			widget: widgets.select()
		}),
		fillingMechanisms: fields.string({
			label: 'Filling Mechanism(s)',
			required: true,
			errorAfterField: true,
			choices: choices.fillingMechanisms,
			widget: widgets.multipleSelect()
		}),
		properties: fields.string({
			required: true,
			errorAfterField: true,
			choices: choices.properties,
			widget: widgets.multipleSelect()
		}),
		description: fields.string({
			required: true,
			errorAfterField: true,
			widget: widgets.textarea({
				rows: 2
			})
		}),
		image_url: fields.url({
			required: validators.required('Variant image is required'),
			errorAfterField: true,
			validators: [validators.url()],
			widget: widgets.hidden()
		}),
		thumbnail_url: fields.url({
			widget: widgets.hidden()
		})
	};

	// Add sale status field if updating product
	if (formType == 'update') {
		formFields.sale_status_id = fields.string({
			label: 'Sale Status',
			required: true,
			errorAfterField: true,
			choices: choices.saleStatuses,
			widget: widgets.select()
		});
	}

	return forms.create(formFields, options);
};

// Attributes of variant
// -> fountainPenId (retrieve from req.params or from creation of new product), nibMaterials, nibShapes, nibFlexibilities, nibSizes, colors
const createVariantForm = (choices) => {
	return forms.create(
		{
			nib_size_id: fields.string({
				label: 'Nib Size',
				required: true,
				errorAfterField: true,
				choices: choices.nibSizes,
				widget: widgets.select()
			}),
			nib_shape_id: fields.string({
				label: 'Nib Shape',
				required: true,
				errorAfterField: true,
				choices: choices.nibShapes,
				widget: widgets.select()
			}),
			nib_flexibility_id: fields.string({
				label: 'Nib Flexibility',
				required: true,
				errorAfterField: true,
				choices: choices.nibFlexibilities,
				widget: widgets.select()
			}),
			nib_material_id: fields.string({
				label: 'Nib Material',
				required: true,
				errorAfterField: true,
				choices: choices.nibMaterials,
				widget: widgets.select()
			}),
			color_id: fields.string({
				label: 'Color',
				required: true,
				errorAfterField: true,
				choices: choices.colors,
				widget: widgets.select()
			}),
			cost: fields.number({
				label: 'Cost (cents)',
				required: true,
				errorAfterField: true,
				validators: [validators.integer(), validators.min(0)]
			}),
			stock: fields.number({
				required: true,
				errorAfterField: true,
				validators: [
					validators.integer(),
					validators.min(0),
					validators.max(65535)
				]
			}),
			image_url: fields.url({
				required: validators.required('Variant image is required'),
				errorAfterField: true,
				validators: [validators.url()],
				widget: widgets.hidden()
			}),
			thumbnail_url: fields.url({
				widget: widgets.hidden()
			})
		},
		options
	);
};

// Attributes for search form
// -> brands, filling mechanisms, cap types, sale statuses
const createSearchForm = (choices) => {
	return forms.create(
		{
			brand_id: fields.string({
				label: 'Brand',
				required: false,
				errorAfterField: true,
				choices: choices.brands,
				widget: widgets.select()
			}),
			model: fields.string({
				required: false,
				errorAfterField: true
			}),
			min_stock: fields.number({
				required: false,
				errorAfterField: true,
				widget: widgets.number(),
				validators: [
					validators.min(0),
					validators.integer(),
					function (form, field, callback) {
						if (field.data > form.data.max_stock) {
							callback(
								'Min stock must be smaller than Max stock'
							);
						} else {
							callback();
						}
					}
				]
			}),
			max_stock: fields.number({
				required: false,
				errorAfterField: true,
				widget: widgets.number(),
				validators: [
					validators.min(0),
					validators.integer(),
					function (form, field, callback) {
						if (field.data < form.data.min_stock) {
							callback(
								'Max stock must be greater than Min stock'
							);
						} else {
							callback();
						}
					}
				]
			}),
			fillingMechanisms: fields.string({
				required: false,
				errorAfterField: true,
				choices: choices.fillingMechanisms,
				widget: widgets.multipleSelect()
			}),
			cap_type_id: fields.string({
				label: 'Cap Type',
				required: false,
				errorAfterField: true,
				choices: choices.capTypes,
				widget: widgets.select()
			}),
			sale_status_id: fields.string({
				label: 'Sale Status',
				required: false,
				errorAfterField: true,
				choices: choices.saleStatuses,
				widget: widgets.select()
			})
		},
		options
	);
};

const createRegistrationForm = () => {
	return forms.create(
		{
			name: fields.string({
				required: true,
				errorAfterField: true,
				validators: [validators.maxlength(100)]
			}),
			username: fields.string({
				required: true,
				errorAfterField: true,
				validators: [validators.maxlength(100)]
			}),
			email: fields.email({
				required: true,
				errorAfterField: true,
				widget: widgets.email(),
				validators: [validators.maxlength(320)]
			}),
			password: fields.password({
				required: true,
				errorAfterField: true,
				validators: [validators.maxlength(100)]
			}),
			confirm_password: fields.password({
				label: 'Re-enter password',
				required: validators.required('Please re-enter password'),
				errorAfterField: true,
				validators: [
					validators.matchField('password'),
					validators.maxlength(100)
				]
			}),
			contact_number: fields.string({
				required: true,
				errorAfterField: true,
				widget: widgets.tel(),
				validators: [validators.maxlength(15)]
			})
		},
		options
	);
};

const createLoginForm = () => {
	return forms.create({
		username: fields.string({
			required: true,
			errorAfterField: true
		}),
		password: fields.password({
			required: true,
			errorAfterField: true
		})
	}, options);
};

module.exports = {
	bootstrapField,
	createProductForm,
	createVariantForm,
	createSearchForm,
	createRegistrationForm,
	createLoginForm
};
