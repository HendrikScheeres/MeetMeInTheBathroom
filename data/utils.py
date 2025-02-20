import pandas as pd

def load_csv(file_path: str) -> pd.DataFrame:
    """
    Load a CSV file into a pandas DataFrame.
    """
    delimiter = ";"
    df = pd.read_csv(file_path, delimiter=delimiter)

    # turn all None values into empty strings
    df = df.fillna("")

    return df
