import cv2
import numpy as np
from tensorflow.keras.applications.efficientnet import preprocess_input

TARGET_SIZE = (300, 300)


def hair_removal(img_bgr):
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (17, 17))
    blackhat = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, kernel)
    _, mask = cv2.threshold(blackhat, 10, 255, cv2.THRESH_BINARY)
    return cv2.inpaint(img_bgr, mask, 1, cv2.INPAINT_TELEA)


def apply_clahe(img_bgr):
    lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l = clahe.apply(l)
    merged = cv2.merge((l, a, b))
    return cv2.cvtColor(merged, cv2.COLOR_LAB2BGR)


def preprocess_image(file_path):
    img_bgr = cv2.imread(file_path)
    if img_bgr is None:
        raise ValueError("Image not found or invalid path")

    img_bgr = apply_clahe(img_bgr)
    img_bgr = hair_removal(img_bgr)

    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    img_rgb = cv2.resize(img_rgb, TARGET_SIZE)

    img_array = np.array(img_rgb, dtype=np.float32)
    img_array = preprocess_input(img_array)

    img_array = np.expand_dims(img_array, axis=0)
    return img_array