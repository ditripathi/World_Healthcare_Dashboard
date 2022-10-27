import pandas as pd
df_pcp = pd.read_csv("Raw Datasets/Barplot_Dataset_v6.csv")
df = pd.read_csv("Raw Datasets/Barplot_Dataset_v8.csv")

df_dis = pd.read_csv("Raw Datasets/World_Disease_Data.csv")

base_variables = ["Country","Numeric_code"]

def get_barplot_data(variable_name, min_year, max_year, country_count = 30):
    
    df_year = df[(df["Year"]>=min_year) & (df["Year"]<=max_year)]
    df_year = df_year.groupby(by=["Country","Numeric_code"]).sum().reset_index()
    sorted_df = df_year.sort_values(by="Population", ascending=False).head(country_count)
    sorted_df = sorted_df[(base_variables+[variable_name,"Population"])]
    return sorted_df.to_dict(orient='records')

def get_multilineplot_data(variable1, variable2, country):
    if country!="world":
        df_country = df[df["Country"]==country][["Year",variable1, variable2]]
        
        return df_country.to_dict(orient='records')
    else:
        df_world = df[["Year",variable1, variable2]]

        df_world = df_world.groupby(by=["Year"]).sum().reset_index()
        return df_world.to_dict(orient='records')

def get_scatterplot_data(variable1, variable2, variable3, year):
    df2 = df[df["Year"]==year][["Country", variable1, variable2, variable3]]
    df2 = df2.dropna(how='any')
    
    return df2.to_dict(orient='records')

def get_geomap_data(year):
    df2 = df[df["Year"]==year][["Country", "Healthcare Expenditure","Numeric_code"]]
    df2 = df2.dropna(how='any')
    
    return df2.to_dict(orient='records')

def get_pcp_data(year, country= "World"):

    df_year = df.loc[df['Year'] == year]
    df_pcp_v2 = df_year.dropna(how='any')
    df_pcp_v2 = df_pcp_v2[["BirthRate","LifeExpectancy","GDPPerCapita","Healthcare Expenditure","MortalityRate", "HDI Index"]]

    result_data = df_pcp_v2.to_dict(orient='records')
    # print("===================================")
    # print("The data returned is: ",result_data)
    # print("===================================")
    return result_data

def get_barplot2_data(year, country="World"):
    disease_cols = ["High BP", "Low Grains", "Alcohol", "Unsafe water source", "Air pollution", "Unsafe sanitation", "Low Bone Density", "Vitamin A deficiency", "Iron deficiency", "Low in Fruits-Nuts-Veggies"]
    base_cols = ["Country","Numeric_code"]

    if country=="World":
        disease_list = []
        df_year = df[df["Year"]==year]
        population_sum = float(df_year["Population"].sum())

        # df_disease = df_year.groupby(by=disease_cols).sum().reset_index()
        for col in disease_cols:
            disease_list.append({"DeathCause":col, "Value":round((df_year[col].sum()/population_sum)*100,2)})
        return disease_list
    else:
        disease_list = []
        df_disease = df[(df["Year"]==year) & (df["Country"]==country)]
        population_sum = float(df_disease["Population"])

        df_year_world = df[df["Year"]==year]
        population_sum_world = float(df_year_world["Population"].sum())

        for col in disease_cols:
            Country_val= round(float(df_disease[col]))
            World_val = round(df_year_world[col].sum())
            Avg_val = round(df_year_world[col].mean())
            
            # print("World val :",df_year_world[col].sum(),"Population : ",population_sum_world)
            # Avg_val = round((df_year_world[col].sum()/population_sum_world)*100)
                                
            disease_list.append({"DeathCause":col, 
                                "Country":Country_val,
                                "World":World_val,
                                "Avg":Avg_val,
                                "total":(Country_val+World_val+Avg_val)
                                })
        print(disease_list)
        return {"data":disease_list,"columns":disease_cols}

        

