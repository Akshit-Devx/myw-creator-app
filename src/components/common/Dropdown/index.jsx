import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Menu, Button, Provider} from 'react-native-paper';

const CategoryDropdown = () => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState('Categories');

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const categories = [
    'Beach',
    'Boutique',
    'Budget',
    'Couple',
    'Eco-friendly',
    'Family',
    'Heritage',
    'Hill',
    'Hotel',
    'Leisure',
    'Luxury',
    'Mountain',
    'Nature',
    'Premium',
    'Private-pool',
    'Resort',
    'Scenic',
  ];

  return (
    <Provider>
      <View style={styles.container}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Button
              mode="outlined"
              onPress={openMenu}
              style={styles.button}
              labelStyle={styles.label}>
              {selected}
            </Button>
          }
          contentStyle={styles.menuContent}>
          {categories.map(item => (
            <Menu.Item
              key={item}
              onPress={() => {
                setSelected(item);
                closeMenu();
              }}
              title={item}
            />
          ))}
        </Menu>
      </View>
    </Provider>
  );
};

export default CategoryDropdown;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'flex-start',
  },
  button: {
    borderRadius: 8,
    borderColor: '#D1D5DB',
  },
  label: {
    color: '#111827',
    fontWeight: '600',
  },
  menuContent: {
    borderRadius: 12,
    paddingVertical: 4,
  },
});
