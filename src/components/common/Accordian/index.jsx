import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Accordion = ({
  title,
  children,
  isExpanded = false,
  onToggle,
  className,
  headerClassName,
  titleClassName,
  contentClassName,
  animationDuration = 300,
  expandIcon = '+',
  collapseIcon = '-',
  iconClassName,
  disabled = false,
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const animationRef = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  const toggleAccordion = () => {
    if (disabled) return;

    const newExpanded = !expanded;
    setExpanded(newExpanded);

    Animated.timing(animationRef, {
      toValue: newExpanded ? 1 : 0,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();

    LayoutAnimation.configureNext({
      duration: animationDuration,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });

    onToggle?.(newExpanded);
  };

  const rotateIcon = animationRef.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View
      className={`bg-white rounded-lg my-1 overflow-hidden shadow-md ${
        className || ''
      }`}>
      <TouchableOpacity
        className={`flex-row justify-between items-center p-4 bg-gray-50 border-b border-gray-200 ${
          disabled ? 'bg-gray-100' : ''
        } ${headerClassName || ''}`}
        onPress={toggleAccordion}
        activeOpacity={disabled ? 1 : 0.7}>
        <Text
          className={`text-base font-semibold text-gray-800 flex-1 ${
            disabled ? 'text-gray-400' : ''
          } ${titleClassName || ''}`}>
          {title}
        </Text>
        <Animated.Text
          className={`text-lg font-bold text-gray-600 ml-2 ${
            disabled ? 'text-gray-400' : ''
          } ${iconClassName || ''}`}
          style={{transform: [{rotate: rotateIcon}]}}>
          {expanded ? collapseIcon : expandIcon}
        </Animated.Text>
      </TouchableOpacity>

      {expanded && (
        <Animated.View
          className={`p-4 bg-white ${contentClassName || ''}`}
          style={{opacity: animationRef}}>
          {children}
        </Animated.View>
      )}
    </View>
  );
};

// Multi-Accordion Component for managing multiple accordions
const AccordionGroup = ({
  data,
  allowMultiple = false,
  className,
  accordionClassName,
  renderItem,
}) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const handleToggle = (index, isExpanded) => {
    const newExpandedItems = new Set(expandedItems);

    if (isExpanded) {
      if (!allowMultiple) {
        newExpandedItems.clear();
      }
      newExpandedItems.add(index);
    } else {
      newExpandedItems.delete(index);
    }

    setExpandedItems(newExpandedItems);
  };

  return (
    <View className={className}>
      {data.map((item, index) => (
        <Accordion
          key={item.key || index}
          title={item.title}
          isExpanded={expandedItems.has(index)}
          onToggle={expanded => handleToggle(index, expanded)}
          className={`my-0.5 ${accordionClassName || ''}`}
          {...item.props}>
          {renderItem ? renderItem(item, index) : item.content}
        </Accordion>
      ))}
    </View>
  );
};

export default Accordion;
export {AccordionGroup};

// Usage Examples:

// Basic Accordion
/*
<Accordion title="Basic Accordion">
  <Text className="text-gray-700">This is the content of the accordion.</Text>
</Accordion>
*/

// Controlled Accordion
/*
const [isOpen, setIsOpen] = useState(false);

<Accordion
  title="Controlled Accordion"
  isExpanded={isOpen}
  onToggle={setIsOpen}
>
  <Text className="text-gray-700">This accordion is controlled by parent state.</Text>
</Accordion>
*/

// Custom Styled Accordion with NativeWind
/*
<Accordion
  title="Custom Styled"
  headerClassName="bg-blue-600"
  titleClassName="text-white font-bold"
  iconClassName="text-white"
  contentClassName="bg-blue-50"
  expandIcon="▼"
  collapseIcon="▲"
>
  <Text className="text-blue-800">Custom styled accordion content.</Text>
</Accordion>
*/

// Accordion with different color themes
/*
<Accordion
  title="Success Theme"
  headerClassName="bg-green-100 border-green-200"
  titleClassName="text-green-800"
  iconClassName="text-green-600"
  contentClassName="bg-green-50"
>
  <Text className="text-green-700">Success themed content.</Text>
</Accordion>

<Accordion
  title="Warning Theme"
  headerClassName="bg-yellow-100 border-yellow-200"
  titleClassName="text-yellow-800"
  iconClassName="text-yellow-600"
  contentClassName="bg-yellow-50"
>
  <Text className="text-yellow-700">Warning themed content.</Text>
</Accordion>
*/

// Accordion Group with custom styling
/*
const accordionData = [
  {
    title: 'Section 1',
    content: <Text className="text-gray-600">Content for section 1</Text>,
    key: 'section1',
    props: {
      headerClassName: 'bg-purple-100',
      titleClassName: 'text-purple-800',
    },
  },
  {
    title: 'Section 2',
    content: <Text className="text-gray-600">Content for section 2</Text>,
    key: 'section2',
    props: {
      headerClassName: 'bg-indigo-100',
      titleClassName: 'text-indigo-800',
    },
  },
];

<AccordionGroup
  data={accordionData}
  allowMultiple={false}
  className="m-4"
  accordionClassName="shadow-lg"
/>
*/

// Minimalist Accordion
/*
<Accordion
  title="Minimalist Style"
  className="border border-gray-200 rounded-none shadow-none"
  headerClassName="bg-white border-b-0"
  titleClassName="text-gray-900 font-normal"
  iconClassName="text-gray-400"
  expandIcon="+"
  collapseIcon="−"
>
  <Text className="text-gray-600 leading-relaxed">
    Clean, minimalist accordion design.
  </Text>
</Accordion>
*/

// Card-style Accordion
/*
<Accordion
  title="Card Style"
  className="mx-4 shadow-xl"
  headerClassName="bg-gradient-to-r from-blue-600 to-purple-600"
  titleClassName="text-white font-bold text-lg"
  iconClassName="text-white text-xl"
  contentClassName="bg-gray-50"
>
  <View className="space-y-2">
    <Text className="text-gray-800 font-medium">Card-style accordion</Text>
    <Text className="text-gray-600">With gradient header and enhanced shadow.</Text>
  </View>
</Accordion>
*/
