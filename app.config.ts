import { type ConfigContext, type ExpoConfig } from '@expo/config';
import { withAppBuildGradle } from '@expo/config-plugins';

const RELEASE_SIGNING_CONFIG = `
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }`;

export default ({ config }: ConfigContext): ExpoConfig =>
  withAppBuildGradle(config as ExpoConfig, (mod) => {
    let contents = mod.modResults.contents;

    // java.time.* backport for Android < 8 (API < 26)
    if (!contents.includes('coreLibraryDesugaringEnabled')) {
      if (contents.includes('compileOptions')) {
        contents = contents.replace(
          /compileOptions\s*\{/,
          'compileOptions {\n        coreLibraryDesugaringEnabled true',
        );
      } else {
        contents = contents.replace(
          /compileSdk\s+rootProject\.ext\.compileSdkVersion/,
          'compileSdk rootProject.ext.compileSdkVersion\n\n    compileOptions {\n        coreLibraryDesugaringEnabled true\n        sourceCompatibility JavaVersion.VERSION_1_8\n        targetCompatibility JavaVersion.VERSION_1_8\n    }',
        );
      }
    }

    if (!contents.includes('desugar_jdk_libs')) {
      contents = contents.replace(
        /^dependencies\s*\{/m,
        'dependencies {\n    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.1.4")',
      );
    }

    // Release signing via gradle.properties (MYAPP_UPLOAD_*)
    if (!contents.includes('MYAPP_UPLOAD_STORE_FILE')) {
      contents = contents.replace(
        /(signingConfigs\s*\{[\s\S]*?keyPassword\s+'android'\s*\})\s*\}/,
        `$1${RELEASE_SIGNING_CONFIG}\n    }`,
      );
      contents = contents.replace(
        // Switch release buildType from the placeholder debug keystore
        '// Caution! In production, you need to generate your own keystore file.\n            // see https://reactnative.dev/docs/signed-apk-android.\n            signingConfig signingConfigs.debug',
        'signingConfig signingConfigs.release',
      );
    }

    mod.modResults.contents = contents;
    return mod;
  });
