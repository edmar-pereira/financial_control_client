import React from 'react';
import { NumericFormat } from 'react-number-format';

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      allowNegative={false}
      allowLeadingZeros={false}
      thousandSeparator={false}
      decimalSeparator="."
      decimalScale={2}
      fixedDecimalScale
      valueIsNumericString
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value, // This will be a string like "123.45"
          },
        });
      }}
      // Key: this is what makes it work like a "mask"
      isNumericString
      prefix="R$ "
      customInput={props.inputComponent}
      // This autoformats input like: typing "12345" becomes "123.45"
      format={(val) => {
        const numeric = val.replace(/\D/g, ''); // Remove non-digits
        if (!numeric) return '0.00';
        const padded = numeric.padStart(3, '0'); // ensure minimum 3 digits (to show cents)
        const beforeDecimal = padded.slice(0, -2);
        const cents = padded.slice(-2);
        return `${parseInt(beforeDecimal, 10)}.${cents}`;
      }}
    />
  );
});


export { NumericFormatCustom };
