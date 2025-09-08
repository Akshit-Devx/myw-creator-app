import React, {memo, useState} from 'react';
import {View, Text, TouchableOpacity, Image, Modal} from 'react-native';

import Video from 'react-native-video';
import {uploadData} from 'aws-amplify/storage';
import {launchImageLibrary} from 'react-native-image-picker';

import Button from '../elements/Button';
import {Icons} from '../../assets/icons';
import {formatFileSize, getMediaURL} from '../../utility/helper';

const UploadingFile = memo(({onPressCancel, progress}) => {
  return (
    <View className="border border-gray-300 rounded-lg flex-row items-center gap-4 p-5 w-full bg-white">
      <View className="flex-1 flex-col gap-1">
        <Text className="text-md font-medium text-[#0b0b0b]">Uploading...</Text>
        <View className="w-full h-1 bg-gray-500 rounded-full">
          <View
            className="h-1 bg-blue-500 rounded-full"
            style={{width: `${progress}%`}}
          />
        </View>
      </View>
      <TouchableOpacity onPress={onPressCancel}>
        <Icons.CrossIcon width={20} height={20} />
      </TouchableOpacity>
    </View>
  );
});

const FileUploadedCompleted = memo(
  ({file, type, onPressCancel, onPressView, previewUrl}) => {
    return (
      <View className="bg-white border border-gray-300 rounded-lg flex-row items-start gap-4 p-3 w-full">
        <View>
          {type === 'POST' ? (
            <Image source={{uri: previewUrl}} className="w-[100] h-[154]" />
          ) : (
            <Video
              source={{uri: previewUrl}}
              style={{
                width: 50,
                flex: 1,
                backgroundColor: 'red',
                borderRadius: 8,
                overflow: 'hidden',
              }}
              muted
              repeat
              resizeMode="cover"
            />
          )}
        </View>
        <View className="flex-1 flex-col gap-1">
          <Text
            className="text-md font-semibold text-[#0b0b0b]"
            numberOfLines={3}>
            {file?.name || file?.fileName}
          </Text>
          <Text className="text-md font-normal text-[#6d6d6d]">
            {formatFileSize(file?.size || file?.fileSize)}
          </Text>
        </View>
        <TouchableOpacity onPress={onPressView}>
          <Text className="text-md font-normal text-blue-500">View</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressCancel}>
          <Icons.CrossIcon width={20} height={20} />
        </TouchableOpacity>
      </View>
    );
  },
);

const UploadFailed = memo(({file, onPressCancel}) => {
  return (
    <View className="border border-gray-300 rounded-lg flex-row items-center gap-4 p-5 w-full bg-white">
      <View className="flex-1 flex-col gap-1">
        <Text
          className="text-md font-semibold text-[#0b0b0b]"
          numberOfLines={3}>
          {file?.name}
        </Text>
        <Text className="text-md font-medium text-[#FF3636]">
          Upload failed
        </Text>
      </View>
      <TouchableOpacity onPress={onPressCancel}>
        <Icons.CrossIcon width={20} height={20} />
      </TouchableOpacity>
    </View>
  );
});

const FileUpload = ({
  name,
  title,
  subHeading,
  description,
  maxFiles = 2,
  files,
  setFiles,
  path,
  type,
}) => {
  const acceptedFileTypes = type === 'POST' ? 'image' : 'video';

  const [previewFile, setPreviewFile] = useState(null);

  const handleButtonClick = () => {
    try {
      launchImageLibrary(
        {
          mediaType: acceptedFileTypes,
          selectionLimit: maxFiles,
        },
        response => {
          if (response.assets && response.assets.length > 0) {
            response.assets.forEach(file => simulateUpload(file));
          }
        },
      );
    } catch (error) {
      console.error('error: in handleButtonClick', error);
    }
  };

  const handleRemoveFile = id => {
    setFiles(prev => {
      const updatedFiles = prev.filter(item => item.id !== id);
      return updatedFiles;
    });
  };

  const simulateUpload = async file => {
    const fileId = `${file.fileName}-${Date.now()}`;

    const newFile = {
      id: fileId,
      file,
      progress: 0,
      status: 'uploading',
      timeRemaining: 30,
      key: '',
    };

    setFiles(prev => [...prev, newFile]);

    try {
      const progressInterval = setInterval(() => {
        setFiles(prev => {
          const currentFile = prev.find(item => item.id === fileId);
          if (!currentFile || currentFile.progress >= 100) {
            clearInterval(progressInterval);
            return prev;
          }

          const newProgress = Math.min(currentFile.progress + 10, 95);
          const newTimeRemaining = currentFile.timeRemaining
            ? Math.max(Math.floor(currentFile.timeRemaining * 0.8), 1)
            : 5;

          return prev.map(item =>
            item.id === fileId
              ? {
                  ...item,
                  progress: newProgress,
                  timeRemaining: newTimeRemaining,
                }
              : item,
          );
        });
      }, 800);

      const response = await fetch(file?.uri);
      const blob = await response.blob();
      const res = await uploadData({
        key: `${path}/${(file?.fileName)
          .split('.')
          .slice(0, -1)
          .join('')}-${new Date().valueOf()}`,
        data: blob,
        options: {
          contentType: file?.type,
          accessLevel: 'guest',
        },
      }).result;

      clearInterval(progressInterval);
      if (!!res.key) {
        setFiles(prev =>
          prev.map(item =>
            item.id === fileId
              ? {
                  ...item,
                  progress: 100,
                  status: 'completed',
                  timeRemaining: 0,
                  previewUrl: getMediaURL(`public/${res.key}`),
                  key: `public/${res.key}`,
                  type,
                  uploadedAt: new Date().toISOString(),
                }
              : item,
          ),
        );
      } else {
        setFiles(prev =>
          prev.map(item =>
            item.id === fileId
              ? {...item, status: 'failed', progress: 0}
              : item,
          ),
        );
      }
    } catch (error) {
      console.error('Error: ', error);
      setFiles(prev =>
        prev.map(item =>
          item.id === fileId ? {...item, status: 'failed', progress: 0} : item,
        ),
      );
    }
  };

  return (
    <View className="flex-col gap-4">
      <View className="flex-col gap-2">
        <Text className="text-lg font-bold text-[#0b0b0b]">{title}</Text>
        {subHeading && (
          <Text
            className="text-md font-normal text-[#6d6d6d]"
            numberOfLines={1}>
            {subHeading}
          </Text>
        )}
      </View>
      <View className="flex-col gap-2 bg-[#FFFFFF] rounded-lg">
        <View className="p-5 border border-[#1849d6] border-dashed rounded-lg flex-row items-center gap-4">
          <Icons.UploadFileIcon width={40} height={40} />
          <Text className="text-md font-medium text-[#0b0b0b] flex-1">
            {description}
          </Text>
          <Button
            title="Browse files"
            onPress={handleButtonClick}
            variant="secondary"
            className="rounded-xl border-[#1849d6]"
            textClassName="text-[#1849d6]"
          />
        </View>
      </View>
      {files?.map(item => {
        const isUploading = item.status === 'uploading';
        const isCompleted = item.status === 'completed';
        const isFailed = item.status === 'failed';
        return (
          <>
            {isUploading && (
              <UploadingFile
                onPressCancel={() => {
                  handleRemoveFile(item.id);
                }}
                progress={item.progress}
              />
            )}
            {isCompleted && (
              <FileUploadedCompleted
                key={item.id}
                onPressCancel={() => {
                  handleRemoveFile(item.id);
                }}
                onPressView={() => {
                  setPreviewFile(item);
                }}
                file={item.file}
                type={type}
                previewUrl={item.previewUrl}
              />
            )}
            {isFailed && (
              <UploadFailed
                key={item.id}
                onPressCancel={() => {
                  handleRemoveFile(item.id);
                }}
              />
            )}
          </>
        );
      })}
      {previewFile && (
        <Modal
          visible={!!previewFile}
          transparent={true}
          onRequestClose={() => {
            setPreviewFile(null);
          }}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-2 rounded-lg w-4/5">
              {type === 'POST' ? (
                <Image
                  source={{uri: previewFile?.previewUrl}}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <Video
                  source={{uri: previewFile?.previewUrl}}
                  style={{width: '100%', height: 250, borderRadius: 4, overflow: 'hidden'}}
                  resizeMode="cover"
                  controls
                />
              )}
              <TouchableOpacity
                className="absolute top-5 right-5 z-10 bg-white/50 rounded-full p-2"
                onPress={() => setPreviewFile(null)}>
                <Icons.CrossIcon width={24} height={24} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default FileUpload;
