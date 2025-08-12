// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
// Make sure storageBucket is correct — .app was wrong, it should be .appspot.com
const firebaseConfig = {
  apiKey: "AIzaSyCXYXsGb9kPUBYVqLLcPcTTjhavTe9NUpk",
  authDomain: "push-7e76b.firebaseapp.com",
  projectId: "push-7e76b",
  storageBucket: "push-7e76b.appspot.com", // ✅ fixed bucket name
  messagingSenderId: "552579008115",
  appId: "1:552579008115:web:29ea9561aeadc98a1c8c06",
  measurementId: "G-C8VYHBSWQC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

/**
 * Upload a file to Firebase Storage with optional progress tracking.
 * @param file - The file to upload
 * @param setProgress - Optional callback to track upload progress (0–100)
 * @returns Promise<string> - Download URL after upload completes
 */
export async function uploadFile(
  file: File,
  setProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          if (setProgress) setProgress(progress);

          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
          }
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          } catch (err) {
            reject(err);
          }
        }
      );
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}
