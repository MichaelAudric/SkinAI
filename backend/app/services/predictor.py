import numpy as np
# from app.model.model_loader import model_v8, model_v11, model_v14
from app.model.model_loader import model_v8

CLASS_NAMES = ["nv", "mel", "bkl", "bcc", "akiec", "vasc", "df"]


def predict_image(img_array):
    """
    img_array: preprocessed numpy array (1, H, W, 3).
    """

    preds_v8 = model_v8.predict(img_array, verbose=0)
    # preds_v11 = model_v11.predict(img_array, verbose=0)
    # preds_v14 = model_v14.predict(img_array, verbose=0)

    # average probabilities (soft voting)
    # preds = (preds_v8 + preds_v11 + preds_v14) / 3.0
    preds = preds_v8


    class_index = np.argmax(preds)
    confidence = float(np.max(preds))

    return {
        "class": CLASS_NAMES[class_index],
        "confidence": confidence
    }