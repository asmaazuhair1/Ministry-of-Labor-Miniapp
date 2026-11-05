import type { SchemaSection } from "@/types/services";
import { initialValues, flattenFields } from "./helpers";
import { validateField, validateSchema } from "./validators";

/** Reactive form controller: values, per-field errors, touched state, validation. */
export function useFormState(schema: SchemaSection[]) {
    let values = $state<Record<string, string>>(initialValues(schema));
    let errors = $state<Record<string, string>>({});
    let touched = $state<Record<string, boolean>>({});

    function setValue(name: string, value: string) {
        values[name] = value;
        if (touched[name]) {
            const field = flattenFields(schema).find((f) => f.name === name);
            if (field) {
                const err = validateField(field, value);
                if (err) errors[name] = err;
                else delete errors[name];
            }
        }
    }

    function blurField(name: string) {
        touched[name] = true;
        const field = flattenFields(schema).find((f) => f.name === name);
        if (field) {
            const err = validateField(field, values[name] ?? "");
            if (err) errors[name] = err;
            else delete errors[name];
        }
    }

    function validateAll(): boolean {
        const result = validateSchema(schema, values);
        errors = result;
        for (const field of flattenFields(schema)) touched[field.name] = true;
        return Object.keys(result).length === 0;
    }

    return {
        get values() {
            return values;
        },
        get errors() {
            return errors;
        },
        get touched() {
            return touched;
        },
        setValue,
        blurField,
        validateAll,
    };
}
