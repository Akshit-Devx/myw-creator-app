import {useNavigation} from '@react-navigation/native';
import {confirmSignIn, getCurrentUser, signIn, signUp} from 'aws-amplify/auth';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Banners} from '../../assets/banners';
import {Icons} from '../../assets/icons';
import Button from '../../components/elements/Button';
import OTPInput from '../../components/elements/OTPInput';
import PhoneInput from '../../components/elements/PhoneInput';
import {fetchInfluencerById} from '../../store/slices/onBoarding';
import {formatPhoneNumber, generateTempPassword} from '../../utility/helper';

const LoginHeader = memo(({title}) => (
  <View className="flex-col items-center gap-2">
    <Icons.MywallLogo height={90} width={90} />
    <Text className="text-2xl font-bold text-[#1F0B48]">{title}</Text>
  </View>
));

const PhoneStep = memo(
  ({phone, setPhone, phoneError, loading, handleLogin}) => (
    <View className="w-full flex-col gap-10">
      <View className="flex-col gap-2">
        <PhoneInput
          label="Enter your Whatsapp number"
          placeholder="XXXXX XXXXX"
          value={phone}
          onChangeText={text => setPhone(text)}
          error={phoneError}
          disabled={loading}
        />
        <Text className="text-sm text-[#1946E7] font-medium">
          We will send you a code on WhatsApp to confirm your number
        </Text>
      </View>
      <View className="flex-col gap-5">
        <Button
          title="Continue"
          size="lg"
          loading={loading}
          className="w-full"
          onPress={handleLogin}
          disabled={!phone || loading}
        />
        <Text className="text-[#333] text-sm font-medium text-center">
          By continuing, you agree to our T&C
        </Text>
      </View>
    </View>
  ),
);

const OTPStep = memo(
  ({
    phone,
    otp,
    setOtp,
    otpError,
    loading,
    handleVerifyOtp,
    handleChangeNumber,
    handleResendOtp,
    resendOtpCounter,
    isResendOtpEnabled,
  }) => (
    <View className="w-full flex-col gap-8">
      <View className="flex-col justify-center items-center gap-0">
        <Text>We have sent a verification code to your WhatsApp</Text>
        <View className="flex-row items-center gap-1">
          <Text className="font-medium">+91 {phone}</Text>
          <Button
            title="Change Number"
            size="sm"
            variant="ghost"
            onPress={handleChangeNumber}
            disabled={loading}
          />
        </View>
      </View>
      <OTPInput
        length={6}
        value={otp}
        onChange={setOtp}
        error={otpError}
        disabled={loading}
      />

      <View className="flex-col gap-2 items-center">
        <Button
          title="Verify"
          size="lg"
          loading={loading}
          className="w-full"
          onPress={handleVerifyOtp}
          disabled={!otp || loading}
        />
        <Text className="text-[#333] text-md font-medium mt-3">
          Didn't get the OTP?
        </Text>
        <Button
          title={`Resend OTP${
            resendOtpCounter > 0 ? ` (${resendOtpCounter}s)` : ''
          }`}
          variant="ghost"
          onPress={handleResendOtp}
          disabled={!isResendOtpEnabled || loading}
        />
      </View>
    </View>
  ),
);

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {onBoarding} = useSelector(state => state?.onBoarding);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isResendOtpEnabled, setIsResendOtpEnabled] = useState(false);
  const [resendOtpCounter, setResendOtpCounter] = useState(0);
  console.log('onBoarding login screen', onBoarding);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Handle animations when step changes
  const animateTransition = useCallback(
    newStep => {
      // Fade out current content
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setStep(newStep);
        // Reset slide position for new content
        slideAnim.setValue(50);
        // Fade in new content
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      });
    },
    [fadeAnim, slideAnim],
  );

  // Memoized handlers
  const handlePhoneChange = useCallback(text => {
    setPhone(text);
    setPhoneError('');
  }, []);

  const handleOtpChange = useCallback(text => {
    setOtp(text);
    setOtpError('');
  }, []);

  const handleChangeNumber = useCallback(() => {
    animateTransition(1);
    setOtp('');
    setOtpError('');
  }, [animateTransition]);

  const handleLogin = useCallback(async () => {
    setPhoneError('');
    setIsLoading(true);

    const cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      const formattedPhone = formatPhoneNumber(cleanPhone);

      // Try sign up first (new user)
      try {
        await signUp({
          username: formattedPhone,
          password: generateTempPassword(),
          options: {
            userAttributes: {
              phone_number: formattedPhone,
            },
          },
        });
      } catch (signUpError) {
        // Ignore error if user exists
        if (!signUpError.message?.includes('User already exists')) {
          throw signUpError;
        }
      }

      // Proceed with sign in
      const signInResult = await signIn({
        username: formattedPhone,
        options: {
          authFlowType: 'CUSTOM_WITHOUT_SRP',
        },
      });

      if (
        signInResult?.nextStep?.signInStep ===
        'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE'
      ) {
        animateTransition(2);
        setIsResendOtpEnabled(false);
        setResendOtpCounter(30);

        const timer = setInterval(() => {
          setResendOtpCounter(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setIsResendOtpEnabled(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Login error:', error);
      setPhoneError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [phone, animateTransition]);

  const handleResendOtp = useCallback(async () => {
    if (!isResendOtpEnabled || isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phone.replace(/\s+/g, ''));
      await signIn({
        username: formattedPhone,
        options: {
          authFlowType: 'CUSTOM_WITHOUT_SRP',
        },
      });

      setIsResendOtpEnabled(false);
      setResendOtpCounter(30);

      const timer = setInterval(() => {
        setResendOtpCounter(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsResendOtpEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Resend OTP error:', error);
      setOtpError(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isResendOtpEnabled, isLoading, phone]);

  const handleVerifyOtp = useCallback(async () => {
    if (!otp || isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await confirmSignIn({
        challengeResponse: otp,
      });

      if (result?.isSignedIn || result?.signInStep === 'DONE') {
        const loggedInUser = await getCurrentUser();
        console.log('login user', loggedInUser);
        await dispatch(
          fetchInfluencerById(
            `${loggedInUser?.username}::${loggedInUser?.username}`,
          ),
        );
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error.name === 'InvalidLambdaResponseException') {
        setOtpError('Maximum attempts reached. Please try again later.');
      } else {
        setOtpError(error.message || 'Invalid OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [otp, isLoading, dispatch]);

  // Handle navigation based on onBoarding status
  useEffect(() => {
    if (onBoarding?.profileStatusCode === 'step1') {
      navigation.replace('IgUsername');
    } else if (onBoarding?.profileStatusCode === 'done') {
      navigation.replace('Main');
    }
  }, [onBoarding?.profileStatusCode, navigation]);

  return (
    <View className="flex-1 bg-white">
      <View className="h-[50%] w-full">
        <Banners.LoginBanner width="100%" height="100%" />
      </View>
      <View className="flex p-5 flex-col gap-10 items-center justify-center bg-white mt-[-80px] rounded-t-[3rem]">
        <Animated.View
          className="w-full"
          style={{
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          }}>
          <LoginHeader
            title={
              step === 1
                ? "India's #1 Creator Lifestyle App"
                : 'OTP Verification'
            }
          />

          {step === 1 ? (
            <PhoneStep
              phone={phone}
              setPhone={handlePhoneChange}
              phoneError={phoneError}
              loading={isLoading}
              handleLogin={handleLogin}
            />
          ) : (
            <OTPStep
              phone={phone}
              otp={otp}
              setOtp={handleOtpChange}
              otpError={otpError}
              loading={isLoading}
              handleVerifyOtp={handleVerifyOtp}
              handleChangeNumber={handleChangeNumber}
              handleResendOtp={handleResendOtp}
              resendOtpCounter={resendOtpCounter}
              isResendOtpEnabled={isResendOtpEnabled}
            />
          )}
        </Animated.View>
      </View>
    </View>
  );
};

export default LoginScreen;
