import ctypes
import os
import time
import colorsys
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont

# carpetas e imagenes
CARPETA = os.path.dirname(os.path.abspath(__file__))
IMAGEN_FONDO = os.path.join(CARPETA, "img", "fd1.png")     #imagen original
IMAGEN_SALIDA = os.path.join(CARPETA, "img", "fd2.jpg")

MARGEN_ARRIBA = 80
RUTA_FUENTE = r"c:\USERS\ESTEBAN\APPDATA\LOCAL\MICROSOFT\WINDOWS\FONTS\SHIZUOKA CYBERPUNK.OTF"
TAMANO_FUENTE_HORA = 90
TAMANO_FUENTE_FECHA = 32
CICLO_MINUTOS = 10   # cuanto tarda en dar la vuelta

def color_rgb_segun_tiempo():
    ahora = datetime.now()
    segundos_totales = ahora.hour * 3600 + ahora.minute * 60 + ahora.second
    ciclo_segundos = CICLO_MINUTOS * 60
    posicion = (segundos_totales % ciclo_segundos) / ciclo_segundos  # va de 0.0 a 1.0
    r, g, b = colorsys.hsv_to_rgb(posicion, 1.0, 1.0)
    return (int(r * 255), int(g * 255), int(b * 255))

def generar_wallpaper():
    # Abre la imagen base
    img = Image.open(IMAGEN_FONDO).convert("RGB")
    draw = ImageDraw.Draw(img)

    ancho_img, alto_img = img.size  # tamaño real de la imagen/pantalla

    ahora = datetime.now()
    texto_hora = ahora.strftime("%H:%M")
    texto_fecha = ahora.strftime("%A, %d de %B").capitalize()

    # Fuentes
    try:
        fuente_hora = ImageFont.truetype(RUTA_FUENTE, TAMANO_FUENTE_HORA)
        fuente_fecha = ImageFont.truetype(RUTA_FUENTE, TAMANO_FUENTE_FECHA)
    except:
        fuente_hora = ImageFont.load_default()
        fuente_fecha = ImageFont.load_default()

    # Calcula el ancho del texto para centrarlo
    bbox_hora = draw.textbbox((0, 0), texto_hora, font=fuente_hora)
    ancho_hora = bbox_hora[2] - bbox_hora[0]

    bbox_fecha = draw.textbbox((0, 0), texto_fecha, font=fuente_fecha)
    ancho_fecha = bbox_fecha[2] - bbox_fecha[0]

    # Posición X centrada (misma fórmula para ambos textos)
    x_hora = (ancho_img - ancho_hora) // 2
    x_fecha = (ancho_img - ancho_fecha) // 2

    # Posición Y fija
    y_hora = MARGEN_ARRIBA

# si está dentro de un def nunca se te olvide poner la separacion del tab
    color_actual = color_rgb_segun_tiempo()

    draw.text((x_hora, y_hora), texto_hora, font=fuente_hora, fill=color_actual)
    draw.text((x_fecha, y_hora + TAMANO_FUENTE_HORA + 10), texto_fecha, font=fuente_fecha, fill=color_actual)

    img.save(IMAGEN_SALIDA, "JPEG", quality=95)
    return IMAGEN_SALIDA

def poner_como_wallpaper(ruta_imagen):
    # SPI_SETDESKWALLPAPER = 20
    ctypes.windll.user32.SystemParametersInfoW(20, 0, ruta_imagen, 3)

def main():
    print("Generando fondo de pantalla dinámico... (Ctrl+C para detener)")
    while True:
        ruta = generar_wallpaper()
        poner_como_wallpaper(ruta)
        print(f"Actualizado: {datetime.now().strftime('%H:%M:%S')}")
        time.sleep(60)  # 1 minuto antes de actualizar

if __name__ == "__main__":
    main()