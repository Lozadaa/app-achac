import { IonInput, IonInputPasswordToggle, IonText } from "@ionic/react";
import { Control, Controller, FieldValues, Path, RegisterOptions } from "react-hook-form";
import './FormInput.css';

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  placeholder: string;
  type?: "text" | "password";
  rules?: Omit<RegisterOptions<T, Path<T>>, 
    "valueAsNumber" | 
    "valueAsDate" | 
    "setValueAs" | 
    "disabled"
  >;
  className?: string;
  label?: string;
  helperText?: string;
}

export const FormInput = <T extends FieldValues>({ 
  name, 
  control, 
  placeholder, 
  type = "text",
  rules,
  className,
  label,
  helperText
}: FormInputProps<T>) => {
  return (
    <div className="form-input">
      {label && (
        <IonText className="form-input__label">
          {label}
        </IonText>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
          <>
            <IonInput 
              {...field}
              value={value}
              autocomplete="off"
              onIonInput={(e) => onChange(e.detail.value)}
              className={`form-input__input ${className} ${error ? 'form-input__input--error' : ''}`}
              type={type}
              placeholder={placeholder}
              mode="md" 
              fill="outline"
            >
              {type === "password" && (
                <IonInputPasswordToggle mode="md" slot="end" />
              )}
            </IonInput>
            {(error || helperText) && (
              <IonText 
                className={`form-input__helper-text ${error ? 'form-input__helper-text--error' : ''}`}
              >
                {error ? error.message : helperText}
              </IonText>
            )}
          </>
        )}
      />
    </div>
  );
}; 