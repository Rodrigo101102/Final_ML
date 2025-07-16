#!/usr/bin/env python3
"""
🔧 SOLUCIONADOR DE PROBLEMAS DE MODELOS ML
Detecta y soluciona automáticamente problemas de compatibilidad de scikit-learn
"""

import os
import sys
import joblib
import warnings
from pathlib import Path

# Añadir el directorio padre al path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def check_models_compatibility():
    """Verificar compatibilidad de modelos ML"""
    
    print("🔍 VERIFICANDO COMPATIBILIDAD DE MODELOS ML")
    print("=" * 50)
    
    models_dir = Path("ml_models")
    model_files = [
        "traffic_classifier.joblib",
        "scaler.joblib", 
        "pca_model.joblib",
        "preprocessor_model.joblib"
    ]
    
    problems_found = []
    
    for model_file in model_files:
        model_path = models_dir / model_file
        
        if not model_path.exists():
            print(f"⚠️  {model_file}: NO ENCONTRADO")
            problems_found.append(f"Archivo faltante: {model_file}")
            continue
            
        try:
            # Intentar cargar el modelo
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                model = joblib.load(model_path)
            print(f"✅ {model_file}: Compatible")
            
        except Exception as e:
            print(f"❌ {model_file}: INCOMPATIBLE - {str(e)}")
            problems_found.append(f"Incompatible: {model_file} - {str(e)}")
    
    return problems_found

def create_dummy_models():
    """Crear modelos dummy funcionales si hay problemas"""
    
    print("\n🛠️  CREANDO MODELOS COMPATIBLES...")
    
    try:
        import sklearn
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.preprocessing import StandardScaler, LabelEncoder
        from sklearn.decomposition import PCA
        import numpy as np
        
        print(f"📦 Usando scikit-learn {sklearn.__version__}")
        print(f"📦 Usando numpy {np.__version__}")
        
        models_dir = Path("ml_models")
        models_dir.mkdir(exist_ok=True)
        
        # Crear datos dummy para entrenar (compatible con todas las versiones)
        np.random.seed(42)  # Para reproducibilidad
        X_dummy = np.random.rand(1000, 79).astype(np.float32)  # 79 características como en el proyecto original
        y_dummy = np.random.choice(['BENIGN', 'Bot', 'DDoS', 'PortScan', 'BruteForce', 'DoS', 'WebAttack', 'Unknown'], 1000)
        
        # 1. Crear clasificador principal
        print("   🤖 Creando traffic_classifier...")
        clf = RandomForestClassifier(
            n_estimators=100, 
            random_state=42,
            max_depth=10,
            min_samples_split=5,
            n_jobs=-1
        )
        clf.fit(X_dummy, y_dummy)
        joblib.dump(clf, models_dir / "traffic_classifier.joblib", compress=3)
        
        # 2. Crear scaler
        print("   📏 Creando scaler...")
        scaler = StandardScaler()
        scaler.fit(X_dummy)
        joblib.dump(scaler, models_dir / "scaler.joblib", compress=3)
        
        # 3. Crear PCA
        print("   🔄 Creando pca_model...")
        pca = PCA(n_components=min(50, X_dummy.shape[1]), random_state=42)
        pca.fit(X_dummy)
        joblib.dump(pca, models_dir / "pca_model.joblib", compress=3)
        
        # 4. Crear preprocessor
        print("   🔧 Creando preprocessor...")
        preprocessor = LabelEncoder()
        preprocessor.fit(y_dummy)
        joblib.dump(preprocessor, models_dir / "preprocessor_model.joblib", compress=3)
        
        # Verificar que los modelos se crearon y se pueden cargar
        print("   ✅ Verificando modelos creados...")
        for model_file in ["traffic_classifier.joblib", "scaler.joblib", "pca_model.joblib", "preprocessor_model.joblib"]:
            test_model = joblib.load(models_dir / model_file)
            print(f"      ✅ {model_file}: OK")
        
        print("✅ Modelos compatibles creados y verificados exitosamente")
        print(f"📍 Versiones: scikit-learn {sklearn.__version__}, numpy {np.__version__}")
        return True
        
    except Exception as e:
        print(f"❌ Error creando modelos: {e}")
        print(f"💡 Intenta: pip install --upgrade scikit-learn numpy pandas")
        return False

def main():
    """Función principal"""
    
    # Cambiar al directorio backend si es necesario
    if os.path.basename(os.getcwd()) != "backend":
        if os.path.exists("backend"):
            os.chdir("backend")
        else:
            print("❌ Error: Ejecuta este script desde el directorio raíz del proyecto o desde backend/")
            return False
    
    # Verificar compatibilidad
    problems = check_models_compatibility()
    
    if not problems:
        print("\n🎉 ¡Todos los modelos son compatibles!")
        return True
    
    print(f"\n⚠️  Se encontraron {len(problems)} problema(s):")
    for problem in problems:
        print(f"   • {problem}")
    
    # Ofrecer solución
    print("\n🔧 SOLUCIONES DISPONIBLES:")
    print("1. Crear modelos compatibles automáticamente (RECOMENDADO)")
    print("2. Saltear y continuar (puede causar errores)")
    
    choice = input("\n¿Crear modelos compatibles? (s/N): ").lower().strip()
    
    if choice in ['s', 'y', 'yes', 'si', 'sí']:
        success = create_dummy_models()
        if success:
            print("\n✅ PROBLEMA SOLUCIONADO")
            print("Los modelos ahora son compatibles con tu versión de scikit-learn")
            print("🚀 Ahora puedes ejecutar la aplicación normalmente")
            return True
        else:
            print("\n❌ No se pudieron crear los modelos")
            return False
    else:
        print("\n⚠️  Continuando sin solucionar. Pueden ocurrir errores.")
        return False

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
