import {confirmSignIn, signIn, signUp} from 'aws-amplify/auth';
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {Banners} from '../../assets/banners';
import {Icons} from '../../assets/icons';
import Button from '../../components/elements/Button';
import OTPInput from '../../components/elements/OTPInput';
import PhoneInput from '../../components/elements/PhoneInput';
import {formatPhoneNumber} from '../../utility/helper';
import {useNavigation} from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isResendOtpEnabled, setIsResendOtpEnabled] = useState(false);
  const [resendOtpCounter, setResendOtpCounter] = useState(0);

  const handleLogin = async () => {
    // Clear any previous errors
    setPhoneError('');

    // Validate phone number length (excluding spaces)
    const cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phone);
      console.log('Attempting login with:', formattedPhone);

      try {
        // Try signing up first
        const signUpResult = await signUp({
          username: formattedPhone,
          password: 'Test@1234',
          options: {
            userAttributes: {
              phone_number: formattedPhone,
            },
          },
        });
        console.log('SignUp result:', signUpResult);
      } catch (signUpError) {
        // If user already exists, this error is expected
        console.log('SignUp error (might be expected):', signUpError);
      }

      // Proceed with sign in
      const signInResult = await signIn({
        username: formattedPhone,
        options: {
          authFlowType: 'CUSTOM_WITHOUT_SRP',
        },
      });
      console.log('SignIn result:', signInResult);
      if (
        signInResult?.nextStep?.signInStep ===
        'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE'
      ) {
        // Move to OTP screen
        setStep(2);
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
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!isResendOtpEnabled || loading) {
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phone);
      const result = await signIn({
        username: formattedPhone,
        options: {
          authFlowType: 'CUSTOM_WITHOUT_SRP',
        },
      });
      console.log('Resend OTP result:', result);

      // Start cooldown timer
      setIsResendOtpEnabled(false);
      setResendOtpCounter(30); // 30 seconds cooldown

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
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError('');

    if (!otp || otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const result = await confirmSignIn({
        challengeResponse: otp,
      });
      console.log('OTP verification result:', result);
      if (result?.isSignedIn || result?.signInStep === 'DONE') {
        navigation.replace('Tab');
        // Handle successful verification here
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error.name === 'InvalidLambdaResponseException') {
        setOtpError(
          'Maximum attempts reached. Please try again after some time.',
        );
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-[50%]">
        <Banners.LoginBanner width="100%" height="100%" />
      </View>
      {step === 1 && (
        <View className="flex p-5 flex-col gap-11 items-center justify-center bg-white mt-[-80px] rounded-t-[3rem]">
          <View className="flex-col items-center gap-3">
            <Icons.MywallLogo height={90} width={90} />
            <Text className="text-2xl font-bold text-[#1F0B48] ">
              India's #1 Creator Lifestyle App
            </Text>
          </View>
          <View className="w-full flex-col gap-2">
            <PhoneInput
              label="Enter your Whatsapp number"
              placeholder="XXXXX XXXXX"
              value={phone}
              onChangeText={text => {
                setPhone(text);
                setPhoneError('');
              }}
              error={phoneError}
            />
            <Text className="text-sm text-[#1946E7] font-medium">
              We will send you a code on WhatsApp to confirm your number
            </Text>
          </View>
          <View className="w-full flex-col items-center gap-5 justify-center">
            <Button
              title="Continue"
              size="lg"
              loading={loading}
              className="w-full"
              onPress={handleLogin}
            />
            <Text className="text-[#333] text-sm font-medium">
              By continuing, you agree to our T&C
            </Text>
          </View>
        </View>
      )}

      {step === 2 && (
        <View className="flex p-5 flex-col gap-11 items-center justify-center bg-white mt-[-80px] rounded-t-[3rem]">
          <View className="flex-col items-center gap-3">
            <Icons.MywallLogo height={90} width={90} />
            <Text className="text-2xl font-bold text-[#1F0B48] ">
              OTP Verification
            </Text>
            <View className="flex-col">
              <Text>We have sent a verification code to your WhatsApp</Text>
              <View className="flex-row items-center gap-1">
                <Text className="font-medium">+91 {phone}</Text>
                <Button
                  title="Change Number"
                  size="sm"
                  variant="ghost"
                  onPress={() => setStep(1)}
                />
              </View>
            </View>
          </View>

          <View className="w-full flex-col gap-2">
            <OTPInput
              length={6}
              value={otp}
              onChange={val => {
                setOtp(val);
                setOtpError('');
              }}
              error={otpError}
            />
            {otpError ? (
              <Text className="text-red-500 text-md">{otpError}</Text>
            ) : null}
          </View>

          <View className="w-full flex-col items-center gap-3 justify-center">
            <Button
              title="Verify"
              size="lg"
              loading={loading}
              className="w-full"
              onPress={handleVerifyOtp}
            />
            <Text className="text-[#333] text-md font-medium mt-3">
              Didn't get the OTP?
            </Text>

            <View className="flex-row items-center gap-0">
              <Button
                title="Resend OTP"
                size="sm"
                variant="ghost"
                disabled={!isResendOtpEnabled}
                onPress={handleResendOtp}
              />
              {!isResendOtpEnabled && resendOtpCounter > 0 && (
                <Text className="text-gray-400 font-medium">
                  ({resendOtpCounter}s)
                </Text>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default LoginScreen;
