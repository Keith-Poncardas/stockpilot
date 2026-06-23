import React from 'react'
import { Field } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'

export interface IconInputProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'id'> {
    /** Optional class name to customize the outer Field wrapper container. */
    containerClassName?: string
    /** Optional unique ID for the input element. */
    id?: string
    /** Addon element rendered at the start of the input (e.g. an icon). */
    startAddon?: React.ReactNode
    /** Addon element rendered at the end of the input (e.g. an icon, button, or badge). */
    endAddon?: React.ReactNode
}

/**
 * A general-use, customizable input component wrapping the shadcn InputGroup.
 * Allows displaying icons, buttons, or text addons at the start and/or end of the input.
 */
export function IconInput({
    containerClassName,
    className,
    id,
    startAddon,
    endAddon,
    ...props
}: IconInputProps) {
    return (
        <Field className={cn('max-w-sm ', containerClassName)}>
            <InputGroup>
                <InputGroupInput
                    id={id}
                    className={className}
                    {...props}
                />
                {startAddon && (
                    <InputGroupAddon align="inline-start">
                        {startAddon}
                    </InputGroupAddon>
                )}
                {endAddon && (
                    <InputGroupAddon align="inline-end">
                        {endAddon}
                    </InputGroupAddon>
                )}
            </InputGroup>
        </Field>
    )
}

export default IconInput
