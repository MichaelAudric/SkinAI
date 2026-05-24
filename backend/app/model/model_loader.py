import tensorflow as tf
from tensorflow.keras.applications import EfficientNetB3, DenseNet121
from tensorflow.keras.layers import (
    GlobalAveragePooling2D,
    BatchNormalization,
    Dropout,
    Dense
)
from tensorflow.keras.models import Model
from tensorflow.keras import regularizers
import numpy as np

# =========================================================
# CONFIG
# =========================================================

TARGET_SIZE = (300, 300)
NUM_CLASSES = 7

WEIGHTS_V8 = "models/best_model_v8.h5"
WEIGHTS_V11 = "models/best_model_v11.h5"
WEIGHTS_V14 = "models/best_model_v14.h5"

# =========================================================
# MODEL V8 (EfficientNetB3)
# =========================================================

def build_v8():
    base_model = EfficientNetB3(
        weights=None,
        include_top=False,
        input_shape=TARGET_SIZE + (3,)
    )

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = BatchNormalization()(x)
    x = Dropout(0.4)(x)
    x = Dense(256, activation="relu")(x)
    x = Dropout(0.3)(x)
    output = Dense(NUM_CLASSES, activation="softmax")(x)

    return Model(inputs=base_model.input, outputs=output)


# =========================================================
# MODEL V11 (DenseNet121)
# =========================================================

# def build_v11():
#     base_model = DenseNet121(
#         weights=None,
#         include_top=False,
#         input_shape=TARGET_SIZE + (3,)
#     )

#     x = base_model.output
#     x = GlobalAveragePooling2D()(x)
#     x = BatchNormalization()(x)
#     x = Dropout(0.4)(x)
#     x = Dense(256, activation="relu")(x)
#     x = Dropout(0.3)(x)
#     output = Dense(NUM_CLASSES, activation="softmax")(x)

#     return Model(inputs=base_model.input, outputs=output)


# =========================================================
# MODEL V14 (EfficientNetB3 + L2).  
# =========================================================

# def build_v14():
#     base_model = EfficientNetB3(
#         weights=None,
#         include_top=False,
#         input_shape=TARGET_SIZE + (3,)
#     )

#     x = base_model.output
#     x = GlobalAveragePooling2D()(x)
#     x = BatchNormalization()(x)
#     x = Dropout(0.4)(x)
#     x = Dense(
#         256,
#         activation="relu",
#         kernel_regularizer=regularizers.l2(1e-4)
#     )(x)
#     x = Dropout(0.3)(x)
#     output = Dense(NUM_CLASSES, activation="softmax")(x)

#     return Model(inputs=base_model.input, outputs=output)


# =========================================================
# LOAD MODELS.
# =========================================================

model_v8 = build_v8()
model_v8.load_weights(WEIGHTS_V8)

# model_v11 = build_v11()
# model_v11.load_weights(WEIGHTS_V11)

# model_v14 = build_v14()
# model_v14.load_weights(WEIGHTS_V14)


