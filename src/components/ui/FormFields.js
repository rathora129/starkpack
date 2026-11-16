'use client';

import styled from 'styled-components';
import { useId } from 'react';
import { useField } from 'formik';
import { Switch } from '@heroui/react';
import { ChevronDown, Check } from 'lucide-react';
import { colors, fonts, radii, shadows, transitions } from '@/lib/theme';
import { Label, Hint } from './primitives';

export const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const Req = styled.span`
  color: ${colors.copper};
  margin-left: 3px;
`;

const InputWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid ${({ $error }) => ($error ? '#D48974' : '#DCD6C9')};
  border-radius: ${radii.sm};
  background: #fff;
  box-shadow: ${({ $error }) => ($error ? '0 0 0 3px rgba(176, 71, 47, 0.08)' : 'none')};
  transition: border-color ${transitions.fast}, box-shadow ${transitions.fast};

  &:focus-within {
    border-color: ${({ $error }) => ($error ? colors.danger : colors.forest)};
    box-shadow: ${({ $error }) =>
      $error ? '0 0 0 3px rgba(176, 71, 47, 0.1)' : '0 0 0 3px rgba(23, 73, 59, 0.1)'};
  }
`;

const Prefix = styled.span`
  padding-left: 12px;
  color: ${colors.faint};
  font-size: 13px;
  font-weight: 600;
  flex: 0 0 auto;
`;

export const FieldInput = styled.input`
  width: 100%;
  height: 40px;
  padding: ${({ $hasPrefix }) => ($hasPrefix ? '0 12px 0 5px' : '0 12px')};
  border: 0;
  background: transparent;
  font-family: ${fonts.sans};
  font-size: 13px;
  color: ${colors.ink};
  border-radius: ${radii.sm};
  outline: none;
  min-width: 0;

  &::placeholder {
    color: #A7AEA8;
  }

  &:disabled {
    background: ${colors.mist};
    color: ${colors.muted};
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 96px;
  padding: 11px 12px;
  border: 1px solid ${({ $error }) => ($error ? '#D48974' : '#DCD6C9')};
  border-radius: ${radii.sm};
  background: #fff;
  font-family: ${fonts.sans};
  font-size: 13px;
  color: ${colors.ink};
  line-height: 1.6;
  outline: none;
  resize: vertical;
  transition: border-color ${transitions.fast}, box-shadow ${transitions.fast};

  &::placeholder {
    color: #A7AEA8;
  }

  &:focus {
    border-color: ${({ $error }) => ($error ? colors.danger : colors.forest)};
    box-shadow: 0 0 0 3px rgba(23, 73, 59, 0.1);
  }
`;

const SelectWrap = styled.div`
  position: relative;
`;

const Select = styled.select`
  width: 100%;
  height: 40px;
  padding: 0 34px 0 12px;
  border: 1px solid ${({ $error }) => ($error ? '#D48974' : '#DCD6C9')};
  border-radius: ${radii.sm};
  background: #fff;
  font-family: ${fonts.sans};
  font-size: 13px;
  color: ${colors.ink};
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color ${transitions.fast}, box-shadow ${transitions.fast};

  &:focus {
    border-color: ${({ $error }) => ($error ? colors.danger : colors.forest)};
    box-shadow: 0 0 0 3px rgba(23, 73, 59, 0.1);
  }
`;

const Chevron = styled.span`
  position: absolute;
  right: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.faint};
  pointer-events: none;
  display: grid;
  place-items: center;
`;

export const ErrorText = styled.p`
  margin-top: 5px;
  font-size: 11.5px;
  color: ${colors.danger};
  line-height: 1.4;
  font-weight: 500;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ $cols }) => $cols || 'repeat(2, minmax(0, 1fr))'};
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FormActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 9px;
  flex-wrap: wrap;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid ${colors.lineSoft};
`;

export const FormSection = styled.div`
  padding: ${({ $first }) => ($first ? '0 0 20px' : '20px 0')};
  border-top: ${({ $first }) => ($first ? '0' : `1px solid ${colors.lineSoft}`)};

  &:last-child {
    padding-bottom: 0;
  }
`;

export const FormSectionTitle = styled.h4`
  font-family: ${fonts.sans};
  font-size: 13px;
  font-weight: 700;
  color: ${colors.ink};
  margin-bottom: 4px;
`;

export const FormSectionHint = styled.p`
  font-size: 11.5px;
  color: ${colors.muted};
  margin-bottom: 14px;
`;

export function TextField({ label, name, hint, required, prefix, ...props }) {
  const [field, meta] = useField(name);
  const error = meta.touched && meta.error;
  const id = props.id || name;
  return (
    <FieldWrap>
      {label ? (
        <Label htmlFor={id}>
          {label}
          {required ? <Req>*</Req> : null}
        </Label>
      ) : null}
      <InputWrap $error={Boolean(error)}>
        {prefix ? <Prefix>{prefix}</Prefix> : null}
        <FieldInput
          id={id}
          {...field}
          {...props}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          $hasPrefix={Boolean(prefix)}
        />
      </InputWrap>
      {error ? <ErrorText id={`${id}-error`}>{meta.error}</ErrorText> : hint ? <Hint>{hint}</Hint> : null}
    </FieldWrap>
  );
}

export function TextAreaField({ label, name, hint, required, rows = 4, ...props }) {
  const [field, meta] = useField(name);
  const error = meta.touched && meta.error;
  const id = props.id || name;
  return (
    <FieldWrap>
      {label ? (
        <Label htmlFor={id}>
          {label}
          {required ? <Req>*</Req> : null}
        </Label>
      ) : null}
      <TextArea
        id={id}
        rows={rows}
        {...field}
        {...props}
        $error={Boolean(error)}
        aria-invalid={Boolean(error)}
      />
      {error ? <ErrorText>{meta.error}</ErrorText> : hint ? <Hint>{hint}</Hint> : null}
    </FieldWrap>
  );
}

export function SelectField({ label, name, hint, required, options = [], placeholder, ...props }) {
  const [field, meta] = useField(name);
  const error = meta.touched && meta.error;
  const id = props.id || name;
  return (
    <FieldWrap>
      {label ? (
        <Label htmlFor={id}>
          {label}
          {required ? <Req>*</Req> : null}
        </Label>
      ) : null}
      <SelectWrap>
        <Select id={id} {...field} {...props} $error={Boolean(error)}>
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => {
            const value = typeof option === 'string' ? option : option.value;
            const text = typeof option === 'string' ? option : option.label;
            return (
              <option key={value} value={value}>
                {text}
              </option>
            );
          })}
        </Select>
        <Chevron>
          <ChevronDown size={15} />
        </Chevron>
      </SelectWrap>
      {error ? <ErrorText>{meta.error}</ErrorText> : hint ? <Hint>{hint}</Hint> : null}
    </FieldWrap>
  );
}

export function SwitchField({ label, description, name, size = 'sm' }) {
  const [field, , helpers] = useField(name);
  const labelId = useId();
  return (
    <SwitchRow>
      <Switch
        isSelected={Boolean(field.value)}
        onValueChange={(value) => helpers.setValue(value)}
        size={size}
        color="primary"
        aria-labelledby={labelId}
      >
        <span />
      </Switch>
      <SwitchText>
        <SwitchLabel id={labelId}>{label}</SwitchLabel>
        {description ? <SwitchDescription>{description}</SwitchDescription> : null}
      </SwitchText>
    </SwitchRow>
  );
}

const SwitchRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;

  & + & {
    border-top: 1px solid ${colors.lineSoft};
  }
`;

const SwitchText = styled.div`
  min-width: 0;
`;

const SwitchLabel = styled.p`
  font-size: 12.5px;
  font-weight: 700;
  color: ${colors.ink};
  line-height: 1.4;
`;

const SwitchDescription = styled.p`
  font-size: 11.5px;
  color: ${colors.muted};
  line-height: 1.5;
  margin-top: 2px;
`;

const CheckWrap = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  font-size: 12.5px;
  color: ${colors.inkSoft};
  line-height: 1.5;
`;

const CheckBox = styled.span`
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid ${({ $checked }) => ($checked ? colors.forest : '#D3CEC1')};
  background: ${({ $checked }) => ($checked ? colors.forest : '#fff')};
  color: #fff;
  flex: 0 0 auto;
  margin-top: 1px;
  transition: all ${transitions.fast};
`;

export function CheckboxField({ label, name }) {
  const [field, , helpers] = useField({ name, type: 'checkbox' });
  return (
    <CheckWrap>
      <input
        type="checkbox"
        name={name}
        checked={Boolean(field.value)}
        onChange={() => helpers.setValue(!field.value)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <CheckBox $checked={Boolean(field.value)} aria-hidden="true">
        {field.value ? <Check size={12} strokeWidth={3} /> : null}
      </CheckBox>
      <span>{label}</span>
    </CheckWrap>
  );
}

export const FieldHintBox = styled.div`
  border: 1px solid ${colors.line};
  border-radius: ${radii.sm};
  background: #FAFAFD;
  padding: 12px 14px;
  font-size: 11.5px;
  color: ${colors.muted};
  line-height: 1.55;
  box-shadow: ${shadows.xs};
`;
