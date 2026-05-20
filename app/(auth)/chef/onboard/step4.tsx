import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { showMessage } from 'react-native-flash-message';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { StepTopBar } from '@/components/auth/StepTopBar';
import { Button } from '@/components/ui/Button';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { apiErrorMessage, uploadToCloudinary } from '@/services';
import { useChefOnboardStore } from '@/store/chef-onboard.store';
import { makeStyles } from './step4.styles';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CertDocument {
  id: string;
  label: string;
  description: string;
  /** Local URI shown for preview; replaced by Cloudinary URL on upload success. */
  uri: string | null;
  uploading?: boolean;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialDocs: CertDocument[] = [
  {
    id: 'culinary',
    label: 'Culinary School Certificate',
    description: 'Certificate from an accredited culinary school or program.',
    uri: null,
  },
  {
    id: 'food_handler',
    label: "Food Handler's License",
    description: 'Valid food safety / handler license from a recognized authority.',
    uri: null,
  },
  {
    id: 'health',
    label: 'Health Certificate',
    description: 'Current health / medical fitness certificate.',
    uri: null,
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ChefOnboardStep4() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { certifications, upsertCert, removeCert } = useChefOnboardStore();

  // Hydrate from the onboard store so previously-uploaded certs survive
  // navigating back to this step.
  const [docs, setDocs] = useState<CertDocument[]>(() =>
    initialDocs.map((d) => {
      const saved = certifications.find((c) => c.id === d.id);
      return saved ? { ...d, uri: saved.url } : d;
    }),
  );

  const setDocPatch = (id: string, patch: Partial<CertDocument>) => {
    setDocs((prev) => prev.map((doc) => (doc.id === id ? { ...doc, ...patch } : doc)));
  };

  const uploadDoc = async (id: string) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.85,
    });
    if (result.canceled || result.assets.length === 0) return;

    const localUri = result.assets[0].uri;
    setDocPatch(id, { uri: localUri, uploading: true }); // optimistic preview

    try {
      const doc = initialDocs.find((d) => d.id === id);
      const uploaded = await uploadToCloudinary(localUri, {
        folder: 'kula/chefs/certifications',
        resourceType: 'image',
        tags: [id],
      });
      setDocPatch(id, { uri: uploaded.url, uploading: false });
      upsertCert({
        id,
        name: doc?.label ?? id,
        url: uploaded.url,
        publicId: uploaded.publicId,
      });
    } catch (err) {
      setDocPatch(id, { uri: null, uploading: false });
      showMessage({
        message: apiErrorMessage(err, 'Could not upload document. Try again.'),
        type: 'danger',
      });
    }
  };

  const removeDoc = (id: string) => {
    setDocPatch(id, { uri: null, uploading: false });
    removeCert(id);
  };

  const hasAtLeastOne = docs.some((d) => d.uri !== null && !d.uploading);

  return (
    <ScreenWrapper scrollable statusBarStyle="dark">
      <StepTopBar
        totalSteps={5}
        currentStep={4}
        onBack={() => router.back()}
      />

      <View style={styles.body}>
        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Upload Certifications</Text>
          <Text style={styles.subtitle}>
            Upload at least one document. These help us verify your professional credentials.
          </Text>
        </View>

        {/* Document upload cards */}
        <View style={styles.docsWrap}>
          {docs.map((doc) => (
            <View key={doc.id} style={styles.docBlock}>
              <Text style={styles.docLabel}>{doc.label}</Text>
              <Text style={styles.docDesc}>{doc.description}</Text>

              {doc.uri ? (
                /* Uploaded state */
                <View style={styles.previewWrap}>
                  <Image
                    source={{ uri: doc.uri }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                  {doc.uploading && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.35)',
                      }}
                    >
                      <ActivityIndicator color={theme.white} />
                    </View>
                  )}
                  {!doc.uploading && (
                    <Pressable
                      onPress={() => removeDoc(doc.id)}
                      style={styles.removeBtn}
                    >
                      <Ionicons name="close" size={16} color={theme.white} />
                    </Pressable>
                  )}
                </View>
              ) : (
                /* Upload area */
                <Pressable
                  onPress={() => uploadDoc(doc.id)}
                  style={({ pressed }) => [
                    styles.dropzone,
                    pressed ? { opacity: 0.7 } : null,
                  ]}
                >
                  <View style={styles.uploadIconBubble}>
                    <Ionicons name="cloud-upload-outline" size={20} color={theme.primary} />
                  </View>
                  <Text style={styles.uploadCta}>Tap to upload</Text>
                  <Text style={styles.uploadHint}>JPG, PNG up to 5MB</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>

        <Button
          label="Continue"
          size="lg"
          disabled={!hasAtLeastOne}
          onPress={() => router.push('/(auth)/chef/onboard/step5')}
        />
      </View>
    </ScreenWrapper>
  );
}
