import React from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

// Input Field Component
export const InputField = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    onBlur,
    error,
    touched,
    placeholder,
    required = false,
    disabled = false,
    className = '',
    icon,
    ...props
}) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
        <div className={className}>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {icon}
                    </div>
                )}

                <input
                    id={name}
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
                        input-field
                        ${icon ? 'pl-10' : ''}
                        ${isPassword ? 'pr-10' : ''}
                        ${error && touched ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
                        ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                    `}
                    {...props}
                />

                {isPassword && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                        )}
                    </button>
                )}
            </div>

            {error && touched && (
                <div className="mt-1 flex items-center space-x-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                </div>
            )}
        </div>
    );
};

// Select Field Component
export const SelectField = ({
    label,
    name,
    value,
    onChange,
    onBlur,
    error,
    touched,
    options = [],
    placeholder = 'Select an option',
    required = false,
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                className={`
                    input-field
                    ${error && touched ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
                    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                `}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && touched && (
                <div className="mt-1 flex items-center space-x-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                </div>
            )}
        </div>
    );
};

// Textarea Component
export const TextareaField = ({
    label,
    name,
    value,
    onChange,
    onBlur,
    error,
    touched,
    placeholder,
    required = false,
    disabled = false,
    rows = 4,
    className = '',
    ...props
}) => {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                className={`
                    input-field resize-none
                    ${error && touched ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
                    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                `}
                {...props}
            />

            {error && touched && (
                <div className="mt-1 flex items-center space-x-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                </div>
            )}
        </div>
    );
};

// Checkbox Component
export const CheckboxField = ({
    label,
    name,
    checked,
    onChange,
    error,
    touched,
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <div className={className}>
            <div className="flex items-center">
                <input
                    id={name}
                    name={name}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    className={`
                        h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded
                        ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                    `}
                    {...props}
                />
                {label && (
                    <label htmlFor={name} className="ml-2 text-sm text-gray-700">
                        {label}
                    </label>
                )}
            </div>

            {error && touched && (
                <div className="mt-1 flex items-center space-x-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                </div>
            )}
        </div>
    );
};

// Radio Group Component
export const RadioField = ({
    label,
    name,
    value,
    onChange,
    options = [],
    error,
    touched,
    disabled = false,
    className = '',
    orientation = 'vertical',
    ...props
}) => {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}

            <div className={`space-${orientation === 'horizontal' ? 'x' : 'y'}-2 ${orientation === 'horizontal' ? 'flex' : ''}`}>
                {options.map((option) => (
                    <div key={option.value} className="flex items-center">
                        <input
                            id={`${name}-${option.value}`}
                            name={name}
                            type="radio"
                            value={option.value}
                            checked={value === option.value}
                            onChange={onChange}
                            disabled={disabled}
                            className={`
                                h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300
                                ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                            `}
                            {...props}
                        />
                        <label
                            htmlFor={`${name}-${option.value}`}
                            className="ml-2 text-sm text-gray-700"
                        >
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>

            {error && touched && (
                <div className="mt-1 flex items-center space-x-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                </div>
            )}
        </div>
    );
};

// File Upload Component
export const FileUploadField = ({
    label,
    name,
    onChange,
    error,
    touched,
    accept,
    multiple = false,
    disabled = false,
    className = '',
    children,
    ...props
}) => {
    const fileInputRef = React.useRef(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleChange = (e) => {
        onChange(e);
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}

            <div
                onClick={handleClick}
                className={`
                    border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer
                    hover:border-primary-400 hover:bg-primary-50 transition-colors
                    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                    ${error && touched ? 'border-red-300' : ''}
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    name={name}
                    accept={accept}
                    multiple={multiple}
                    onChange={handleChange}
                    disabled={disabled}
                    className="sr-only"
                    {...props}
                />
                {children}
            </div>

            {error && touched && (
                <div className="mt-1 flex items-center space-x-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                </div>
            )}
        </div>
    );
};

// Form Group Component
export const FormGroup = ({ children, className = '' }) => {
    return (
        <div className={`space-y-4 ${className}`}>
            {children}
        </div>
    );
};

// Form Actions Component
export const FormActions = ({
    children,
    className = '',
    align = 'right',
    spacing = 'normal'
}) => {
    const alignClass = align === 'center' ? 'justify-center' : align === 'left' ? 'justify-start' : 'justify-end';
    const spacingClass = spacing === 'tight' ? 'space-x-2' : spacing === 'loose' ? 'space-x-4' : 'space-x-3';

    return (
        <div className={`flex ${alignClass} ${spacingClass} pt-4 border-t border-gray-200 ${className}`}>
            {children}
        </div>
    );
};

const FormComponents = {
    InputField,
    SelectField,
    TextareaField,
    CheckboxField,
    RadioField,
    FileUploadField,
    FormGroup,
    FormActions
};

export default FormComponents;
