import React from 'react'
import {
    Adapt,
    Select,
    Sheet,
    YStack,
    SelectProps,
} from 'tamagui'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {DefaultSize} from "@/components/ui/defaultStyle";

type Option = {
    label: string
    value: string | number
}

type SelectFieldProps = {
    options: Option[]
    placeholder?: string
    value: string | number,
    backgroundColor?: string,
    borderColor? : string,
    onValueChange: (val: string | number) => void
} & SelectProps

export default function SelectFields(
    {
        options,
        placeholder = 'Chọn một mục',
        value,
        onValueChange,
        backgroundColor,
        borderColor,
        ...props
    }: SelectFieldProps) {
    return (
        <Select
            value={String(value)}
            onValueChange={onValueChange}
            disablePreventBodyScroll
            {...props}
        >
            <Select.Trigger iconAfter={<FontAwesome6 name="chevron-down" size={DefaultSize.xl} color="black" />} borderWidth={1} backgroundColor={backgroundColor} borderColor={borderColor}>
                <Select.Value placeholder={placeholder}/>
            </Select.Trigger>

            <Adapt platform="touch">
                <Sheet modal dismissOnSnapToBottom animation="medium">
                    <Sheet.Frame>
                        <Sheet.ScrollView>
                            <Adapt.Contents/>
                        </Sheet.ScrollView>
                    </Sheet.Frame>
                    <Sheet.Overlay
                        backgroundColor="$shadowColor"
                        animation="lazy"
                        enterStyle={{opacity: 0}}
                        exitStyle={{opacity: 0}}
                    />
                </Sheet>
            </Adapt>

            <Select.Content zIndex={200000}>
                <Select.ScrollUpButton
                    alignItems="center"
                    justifyContent="center"
                    height="$3"
                    width="100%"
                >
                    <YStack zIndex={10}>
                        <FontAwesome6 name="chevron-up" size={DefaultSize.xl} color="black" />
                    </YStack>
                </Select.ScrollUpButton>

                <Select.Viewport
                    animation="quick"
                    animateOnly={['transform', 'opacity']}
                    enterStyle={{x: 0, y: -10}}
                    exitStyle={{x: 0, y: 10}}
                >
                    <Select.Group>
                        {options.map((item, index) => (
                            <Select.Item
                                key={item.value}
                                index={index}
                                value={String(item.value)}
                                onPress={() => {

                                }}
                            >
                                <Select.ItemText>{item.label}</Select.ItemText>
                                <Select.ItemIndicator marginLeft="auto">
                                    <FontAwesome6 name="check" size={DefaultSize.xl} color="black" />
                                </Select.ItemIndicator>
                            </Select.Item>
                        ))}
                    </Select.Group>
                </Select.Viewport>

                <Select.ScrollDownButton
                    alignItems="center"
                    justifyContent="center"
                    height="$3"
                    width="100%"
                >
                    <YStack zIndex={10}>
                        <FontAwesome6 name="chevron-down" size={DefaultSize.xl} color="black" />
                    </YStack>
                </Select.ScrollDownButton>
            </Select.Content>
        </Select>
    )
}
