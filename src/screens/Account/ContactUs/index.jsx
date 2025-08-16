import {View, Text, Linking, Alert} from 'react-native';
import {openComposer} from 'react-native-email-link';
import {Icons} from '../../../assets/icons';
import DetailStackHeader from '../../../components/common/DetailStackHeader';
import {useNavigation} from '@react-navigation/native';

const CONTACT_INFO = {
  email: 'support@mywall.me',
  phone: '918130573468',
};

const ContactCard = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}) => (
  <View className="flex-col gap-4 border border-gray-200 p-4 rounded-xl">
    <Icon width={30} height={30} />
    <Text className="text-2xl font-semibold">{title}</Text>
    <Text className="text-md">{description}</Text>
    <Text className="text-md underline active:opacity-70" onPress={onAction}>
      {actionText}
    </Text>
  </View>
);

const ContactUsScreen = () => {
  const navigation = useNavigation();
  const handleWhatsAppPress = async () => {
    try {
      // Try regular WhatsApp first
      const regularWhatsApp = `whatsapp://send?text=&phone=${CONTACT_INFO.phone}`;
      const webWhatsApp = `https://api.whatsapp.com/send?phone=${CONTACT_INFO.phone}`;

      const canOpenRegular = await Linking.canOpenURL(regularWhatsApp);
      if (canOpenRegular) {
        await Linking.openURL(regularWhatsApp);
      } else {
        // Fallback to web link which will open regular WhatsApp if installed
        await Linking.openURL(webWhatsApp);
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
    }
  };

  const handleEmailPress = () => {
    openComposer({
      to: CONTACT_INFO.email,
    }).catch(error => {
      console.error('Error opening email:', error);
      Alert.alert('Error', 'Could not open email app');
    });
  };

  return (
    <View className="flex-1 bg-white">
      <DetailStackHeader
        title="Contact Us"
        onLeftPress={() => navigation.goBack()}
        showRightButton={false}
      />
      <View className="flex-1 bg-white p-5 pt-0 gap-6">
        <View className="flex-col items-start gap-2">
          <Text className="text-3xl font-semibold">Contact Our Team</Text>
          <Text className="text-lg font-medium">
            Let us know how we can help you
          </Text>
        </View>

        <ContactCard
          icon={Icons.MailIcon}
          title="Mail Us"
          description="Have a question or need help? Drop us an email and our team will get back to you shortly."
          actionText={CONTACT_INFO.email}
          onAction={handleEmailPress}
        />

        <ContactCard
          icon={Icons.PhoneIcon}
          title="WhatsApp Us"
          description="Need assistance? Connect with us on WhatsApp and we'll resolve your query promptly."
          actionText="+91-8130573468"
          onAction={handleWhatsAppPress}
        />
      </View>
    </View>
  );
};

export default ContactUsScreen;
