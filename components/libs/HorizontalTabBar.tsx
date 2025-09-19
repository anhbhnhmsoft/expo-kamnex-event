import React, {useRef} from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
    findNodeHandle,
    UIManager
} from 'react-native';
import DefaultColor from "@/components/ui/defaultColor";

type TabRender<T extends string | number> = {
    key: T;
    item: (isActive: boolean) => React.ReactNode;
};

type Props<T extends string | number> = {
    tabs: TabRender<T>[];
    activeKey: T;
    onTabPress: (key: T) => void;
    styleContainer?: ViewStyle;
    styleTab?: ViewStyle;
};

function HorizontalTabBar<T extends string | number>({
                                                         tabs,
                                                         activeKey,
                                                         onTabPress,
                                                         styleContainer,
                                                         styleTab
                                                     }: Props<T>) {
    const scrollRef = useRef<ScrollView>(null);
    const tabRefs = useRef<Map<string, View>>(new Map());

    return (
        <ScrollView
            horizontal
            ref={scrollRef}
            showsHorizontalScrollIndicator={false}
            style={[styles.tabContainer, styleContainer]}
        >
            {tabs.map((tab) => {
                const isActive = tab.key === activeKey;
                return (
                    <TouchableOpacity
                        key={tab.key as string}
                        style={[styles.tabItem, styleTab]}
                        onPress={() => {
                            onTabPress(tab.key)
                            const tabRef = tabRefs.current.get(tab.key as string);
                            if (tabRef && scrollRef.current) {
                                const tabNode = findNodeHandle(tabRef);
                                const scrollNode = findNodeHandle(scrollRef.current);

                                if (tabNode && scrollNode) {
                                    UIManager.measureLayout(
                                        tabNode,
                                        scrollNode,
                                        () => console.warn('measure failed'),
                                        (x, y, width) => {
                                            const screenWidth = Dimensions.get('window').width;
                                            const scrollToX = x + width / 2 - screenWidth / 2;

                                            scrollRef.current?.scrollTo({
                                                x: Math.max(0, scrollToX),
                                                animated: true,
                                            });
                                        }
                                    );
                                }
                            }
                        }}
                    >
                        <View
                            ref={(ref) => {
                                if (ref) tabRefs.current.set(tab.key as string, ref);
                            }}
                        >
                            {tab.item(isActive)}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
    },
    tabItem: {
        marginHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },
});

export default HorizontalTabBar;
