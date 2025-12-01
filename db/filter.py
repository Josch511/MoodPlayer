import pandas as pd

df = pd.read_csv("tracks.csv")

# Nur Zeilen behalten, deren Wert >= 50 ist
df = df[df["popularity"] >= 15]

# Neue Datei speichern
df.to_csv("filtered.csv", index=False)
