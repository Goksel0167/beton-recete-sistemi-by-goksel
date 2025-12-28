import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calculator, Save, Download, Settings, Plus, Edit, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';

// ==================== KONFIGÜRASYON SİSTEMİ ====================
const DEFAULT_CONFIG = {
  concreteClasses: [
    { id: 'C8/10', fck: 8, fcm: 12, stdDev: 4 },
    { id: 'C12/15', fck: 12, fcm: 16, stdDev: 4 },
    { id: 'C16/20', fck: 16, fcm: 20, stdDev: 4 },
    { id: 'C20/25', fck: 20, fcm: 26, stdDev: 4 },
    { id: 'C25/30', fck: 25, fcm: 31, stdDev: 4 },
    { id: 'C30/37', fck: 30, fcm: 36, stdDev: 4 },
    { id: 'C35/45', fck: 35, fcm: 43, stdDev: 4 },
    { id: 'C40/50', fck: 40, fcm: 48, stdDev: 4 },
    { id: 'C45/55', fck: 45, fcm: 53, stdDev: 4 },
    { id: 'C50/60', fck: 50, fcm: 58, stdDev: 4 },
    { id: 'C55/67', fck: 55, fcm: 63, stdDev: 5 },
    { id: 'C60/75', fck: 60, fcm: 68, stdDev: 5 },
    { id: 'C70/85', fck: 70, fcm: 78, stdDev: 5 },
    { id: 'C80/95', fck: 80, fcm: 88, stdDev: 5 }
  ],
  environmentalClasses: [
    { id: 'X0', name: 'Korozyon yok', maxWC: null, minCement: null, minAir: null },
    { id: 'XC1', name: 'Kuru/sürekli ıslak', maxWC: 0.65, minCement: 260, minAir: null },
    { id: 'XC2', name: 'Islak, ara sıra kuru', maxWC: 0.60, minCement: 280, minAir: null },
    { id: 'XC3', name: 'Orta rutubet', maxWC: 0.55, minCement: 280, minAir: null },
    { id: 'XC4', name: 'Döngülü ıslak-kuru', maxWC: 0.50, minCement: 300, minAir: null },
    { id: 'XD1', name: 'Orta rutubet (Cl-)', maxWC: 0.55, minCement: 300, minAir: null },
    { id: 'XD2', name: 'Islak (Cl-)', maxWC: 0.55, minCement: 300, minAir: null },
    { id: 'XD3', name: 'Döngülü (Cl-)', maxWC: 0.45, minCement: 320, minAir: null },
    { id: 'XS1', name: 'Deniz havası', maxWC: 0.50, minCement: 300, minAir: null },
    { id: 'XS2', name: 'Deniz altı', maxWC: 0.45, minCement: 320, minAir: null },
    { id: 'XS3', name: 'Gelgit/dalga', maxWC: 0.45, minCement: 340, minAir: null },
    { id: 'XF1', name: 'Donma (katkısız)', maxWC: 0.55, minCement: 300, minAir: null },
    { id: 'XF2', name: 'Donma (katkılı)', maxWC: 0.55, minCement: 300, minAir: 4.0 },
    { id: 'XF3', name: 'Donma yüksek', maxWC: 0.50, minCement: 320, minAir: 4.0 },
    { id: 'XF4', name: 'Donma çok yüksek', maxWC: 0.45, minCement: 340, minAir: 4.0 },
    { id: 'XA1', name: 'Kimyasal hafif', maxWC: 0.55, minCement: 300, minAir: null },
    { id: 'XA2', name: 'Kimyasal orta', maxWC: 0.50, minCement: 320, minAir: null },
    { id: 'XA3', name: 'Kimyasal yüksek', maxWC: 0.45, minCement: 360, minAir: null },
    { id: 'XM1', name: 'Aşınma orta', maxWC: 0.55, minCement: 300, minAir: null },
    { id: 'XM2', name: 'Aşınma yüksek', maxWC: 0.55, minCement: 300, minAir: null },
    { id: 'XM3', name: 'Aşınma çok yüksek', maxWC: 0.45, minCement: 320, minAir: null }
  ],
  pumpGradationLimits: [
    { sieve: 31.5, min: 90, max: 97 },
    { sieve: 22.4, min: 80, max: 90 },
    { sieve: 16, min: 68, max: 82 },
    { sieve: 11.2, min: 52, max: 69 },
    { sieve: 8, min: 52, max: 69 },
    { sieve: 5.6, min: 37, max: 56 },
    { sieve: 4, min: 37, max: 56 },
    { sieve: 2, min: 26, max: 43 },
    { sieve: 1, min: 17, max: 33 },
    { sieve: 0.5, min: 10, max: 23 },
    { sieve: 0.25, min: 6, max: 16 },
    { sieve: 0.15, min: 3, max: 10 },
    { sieve: 0.063, min: 1, max: 5 }
  ]
};

// ==================== HESAPLAMA MOTORundefined ====================
class ConcreteCalculator {
  static calculateWaterCement(targetStrength, targetWC, envClass) {
    const effectiveWC = envClass.maxWC ? Math.min(targetWC, envClass.maxWC) : targetWC;
    return effectiveWC;
  }

  static calculateCement(water, wc, minCement) {
    const calculated = water / wc;
    return Math.max(calculated, minCement || 0);
  }

  static calculateAdmixture(cement, percentage) {
    return cement * percentage / 100;
  }

  static calculateVolume(cement, water, admixture, air, cementDensity, admixtureDensity) {
    const cementVol = cement / cementDensity;
    const waterVol = water;
    const admixtureVol = admixture / admixtureDensity;
    const airVol = air * 10;
    return {
      cement: cementVol,
      water: waterVol,
      admixture: admixtureVol,
      air: airVol,
      total: cementVol + waterVol + admixtureVol + airVol
    };
  }

  static calculateAggregateAmount(totalVolume, volumes, aggregateDensity) {
    const aggregateVolume = 1000 - volumes.total;
    return aggregateVolume * aggregateDensity;
  }

  static calculateWeightedDensity(aggregates, ratios) {
    let sum = 0;
    aggregates.forEach((agg, i) => {
      if (ratios[i] > 0) {
        sum += (ratios[i] / 100) / agg.density;
      }
    });
    return 1 / sum;
  }

  static calculateCombinedGradation(aggregates, ratios, sieveAnalysis) {
    const sieves = [31.5, 22.4, 16, 11.2, 8, 5.6, 4, 2, 1, 0.5, 0.25, 0.15, 0.063];
    return sieves.map(sieve => {
      let combined = 0;
      aggregates.forEach((agg, i) => {
        const analysis = sieveAnalysis[i];
        const sieveData = analysis?.find(s => s.sieve === sieve);
        if (sieveData && ratios[i] > 0) {
          combined += sieveData.passing * ratios[i] / 100;
        }
      });
      return { sieve, passing: combined };
    });
  }

  static calculateMoistureCorrection(aggregates, ratios, totalAggregate) {
    let waterCorrection = 0;
    const correctedAggregates = aggregates.map((agg, i) => {
      const amount = totalAggregate * ratios[i] / 100;
      const correction = amount * (agg.absorption - agg.moisture) / 100;
      waterCorrection += correction;
      return {
        ...agg,
        dryAmount: amount,
        moistAmount: amount - correction,
        correction: correction
      };
    });
    return { correctedAggregates, waterCorrection };
  }
}

// ==================== DATA STORE ====================
const useDataStore = () => {
  const [config, setConfig] = useState(() => {
    const stored = localStorage.getItem('beton-config');
    return stored ? JSON.parse(stored) : DEFAULT_CONFIG;
  });

  const [projects, setProjects] = useState(() => {
    const stored = localStorage.getItem('beton-projects');
    return stored ? JSON.parse(stored) : [];
  });

  const saveConfig = (newConfig) => {
    setConfig(newConfig);
    localStorage.setItem('beton-config', JSON.stringify(newConfig));
  };

  const saveProject = (project) => {
    const updated = [...projects];
    const index = updated.findIndex(p => p.id === project.id);
    if (index >= 0) {
      updated[index] = project;
    } else {
      updated.push(project);
    }
    setProjects(updated);
    localStorage.setItem('beton-projects', JSON.stringify(updated));
  };

  const deleteProject = (id) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('beton-projects', JSON.stringify(updated));
  };

  return { config, saveConfig, projects, saveProject, deleteProject };
};

// ==================== ANA UYGULAMA ====================
export default function BetonReceteApp() {
  const { config, saveConfig, projects, saveProject } = useDataStore();
  const [currentView, setCurrentView] = useState('home');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    projectName: '',
    concreteClass: 'C30/37',
    envClass: 'XC4',
    targetWC: 0.48,
    slump: 'S3',
    water: 175,
    cementType: 'CEM II/B 42.5R',
    cementDensity: 3.0,
    admixturePercentage: 1.5,
    admixtureDensity: 1.05,
    useAirEntraining: false,
    airPercentage: 0,
    aggregates: [
      { id: 1, name: '0/4 mm', density: 2.65, absorption: 1.6, moisture: 3.4 },
      { id: 2, name: '4/11.2 mm', density: 2.78, absorption: 0.8, moisture: 1.2 },
      { id: 3, name: '11.2/22.4 mm', density: 2.78, absorption: 0.4, moisture: 1.1 }
    ],
    aggregateRatios: [45, 25, 30],
    sieveAnalysis: [
      [
        { sieve: 8, passing: 100 }, { sieve: 5.6, passing: 98 }, { sieve: 4, passing: 95 },
        { sieve: 2, passing: 80 }, { sieve: 1, passing: 60 }, { sieve: 0.5, passing: 35 },
        { sieve: 0.25, passing: 15 }, { sieve: 0.15, passing: 8 }, { sieve: 0.063, passing: 3 }
      ],
      [
        { sieve: 16, passing: 100 }, { sieve: 11.2, passing: 100 }, { sieve: 8, passing: 85 },
        { sieve: 4, passing: 10 }, { sieve: 2, passing: 5 }
      ],
      [
        { sieve: 31.5, passing: 100 }, { sieve: 22.4, passing: 100 }, { sieve: 16, passing: 90 },
        { sieve: 11.2, passing: 20 }, { sieve: 8, passing: 5 }
      ]
    ]
  });

  // Hesaplamalar
  const calculations = useMemo(() => {
    const concreteClass = config.concreteClasses.find(c => c.id === formData.concreteClass);
    const envClass = config.environmentalClasses.find(e => e.id === formData.envClass);
    
    const wc = ConcreteCalculator.calculateWaterCement(
      concreteClass?.fcm || 36,
      formData.targetWC,
      envClass
    );
    
    const cement = ConcreteCalculator.calculateCement(
      formData.water,
      wc,
      envClass?.minCement
    );
    
    const admixture = ConcreteCalculator.calculateAdmixture(cement, formData.admixturePercentage);
    
    const airContent = formData.useAirEntraining ? (envClass?.minAir || 4.0) : 0;
    
    const volumes = ConcreteCalculator.calculateVolume(
      cement,
      formData.water,
      admixture,
      airContent,
      formData.cementDensity,
      formData.admixtureDensity
    );
    
    const aggregateDensity = ConcreteCalculator.calculateWeightedDensity(
      formData.aggregates,
      formData.aggregateRatios
    );
    
    const totalAggregate = ConcreteCalculator.calculateAggregateAmount(
      1000,
      volumes,
      aggregateDensity
    );
    
    const aggregateAmounts = formData.aggregateRatios.map(ratio => 
      totalAggregate * ratio / 100
    );
    
    const combinedGradation = ConcreteCalculator.calculateCombinedGradation(
      formData.aggregates,
      formData.aggregateRatios,
      formData.sieveAnalysis
    );
    
    const moistureCorrection = ConcreteCalculator.calculateMoistureCorrection(
      formData.aggregates,
      formData.aggregateRatios,
      totalAggregate
    );
    
    const adjustedWater = formData.water + moistureCorrection.waterCorrection - admixture / 2;
    
    return {
      concreteClass,
      envClass,
      wc,
      cement,
      admixture,
      airContent,
      volumes,
      aggregateDensity,
      totalAggregate,
      aggregateAmounts,
      combinedGradation,
      moistureCorrection,
      adjustedWater
    };
  }, [formData, config]);

  // ==================== RENDER ====================
  return (
    <div className="app-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Mono:wght@700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        :root {
          --bg-primary: #0a0e14;
          --bg-secondary: #13171e;
          --bg-tertiary: #1a1f29;
          --accent-primary: #00ff88;
          --accent-secondary: #00bfff;
          --text-primary: #e6edf3;
          --text-secondary: #8b949e;
          --border: #30363d;
          --danger: #ff4444;
          --warning: #ffaa00;
          --success: #00ff88;
        }
        
        body {
          font-family: 'JetBrains Mono', monospace;
          background: var(--bg-primary);
          color: var(--text-primary);
          line-height: 1.6;
          overflow-x: hidden;
        }
        
        .app-container {
          min-height: 100vh;
          background: 
            linear-gradient(135deg, rgba(0, 255, 136, 0.03) 0%, transparent 50%),
            linear-gradient(45deg, rgba(0, 191, 255, 0.03) 0%, transparent 50%),
            var(--bg-primary);
          position: relative;
        }
        
        .app-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 255, 136, 0.02) 2px,
              rgba(0, 255, 136, 0.02) 4px
            );
          pointer-events: none;
          z-index: 1;
        }
        
        .app-header {
          background: var(--bg-secondary);
          border-bottom: 2px solid var(--accent-primary);
          padding: 1.5rem 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0, 255, 136, 0.1);
        }
        
        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .app-title {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .app-title h1 {
          font-family: 'Space Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent-primary);
          text-transform: uppercase;
          letter-spacing: 2px;
          text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
        }
        
        .app-title .version {
          font-size: 0.75rem;
          color: var(--text-secondary);
          padding: 0.25rem 0.5rem;
          border: 1px solid var(--border);
          border-radius: 4px;
          font-weight: 400;
        }
        
        .header-nav {
          display: flex;
          gap: 1rem;
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .btn-primary {
          background: var(--accent-primary);
          color: var(--bg-primary);
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        }
        
        .btn-primary:hover {
          background: #00dd77;
          box-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
          transform: translateY(-2px);
        }
        
        .btn-secondary {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border: 1px solid var(--border);
        }
        
        .btn-secondary:hover {
          background: var(--bg-secondary);
          border-color: var(--accent-secondary);
        }
        
        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          position: relative;
          z-index: 2;
        }
        
        .wizard-container {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .wizard-steps {
          display: flex;
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border);
          overflow-x: auto;
        }
        
        .wizard-step {
          flex: 1;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-right: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s;
          min-width: 200px;
        }
        
        .wizard-step:last-child {
          border-right: none;
        }
        
        .wizard-step:hover {
          background: var(--bg-secondary);
        }
        
        .wizard-step.active {
          background: var(--bg-secondary);
          border-bottom: 2px solid var(--accent-primary);
        }
        
        .wizard-step.completed {
          opacity: 0.7;
        }
        
        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-primary);
          border: 2px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
        }
        
        .wizard-step.active .step-number {
          background: var(--accent-primary);
          color: var(--bg-primary);
          border-color: var(--accent-primary);
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
        }
        
        .wizard-step.completed .step-number {
          background: var(--success);
          border-color: var(--success);
          color: var(--bg-primary);
        }
        
        .step-label {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .step-title {
          font-weight: 500;
          font-size: 0.875rem;
          color: var(--text-primary);
        }
        
        .step-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        
        .wizard-content {
          padding: 2rem;
        }
        
        .form-section {
          margin-bottom: 2rem;
        }
        
        .form-section h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--accent-primary);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-left: 3px solid var(--accent-primary);
          padding-left: 1rem;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .form-group input,
        .form-group select {
          padding: 0.75rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-primary);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        
        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.1);
        }
        
        .form-group input[type="number"] {
          font-variant-numeric: tabular-nums;
        }
        
        .result-card {
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 1rem;
        }
        
        .result-card h4 {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--accent-secondary);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .result-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .result-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: var(--bg-secondary);
          border-radius: 6px;
          border-left: 3px solid var(--accent-primary);
        }
        
        .result-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
        }
        
        .result-value {
          font-size: 1rem;
          font-weight: 700;
          color: var(--accent-primary);
          font-variant-numeric: tabular-nums;
        }
        
        .wizard-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border);
        }
        
        .chart-container {
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 2rem;
          margin-top: 2rem;
        }
        
        .home-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .home-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        
        .home-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
          transform: scaleX(0);
          transition: transform 0.3s;
        }
        
        .home-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent-primary);
          box-shadow: 0 10px 40px rgba(0, 255, 136, 0.2);
        }
        
        .home-card:hover::before {
          transform: scaleX(1);
        }
        
        .home-card h2 {
          font-size: 1.5rem;
          color: var(--accent-primary);
          margin-bottom: 1rem;
        }
        
        .home-card p {
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.6;
        }
        
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-success {
          background: rgba(0, 255, 136, 0.1);
          color: var(--success);
          border: 1px solid var(--success);
        }
        
        .status-warning {
          background: rgba(255, 170, 0, 0.1);
          color: var(--warning);
          border: 1px solid var(--warning);
        }
        
        .status-danger {
          background: rgba(255, 68, 68, 0.1);
          color: var(--danger);
          border: 1px solid var(--danger);
        }
        
        .table-container {
          overflow-x: auto;
          margin-top: 1rem;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }
        
        th {
          background: var(--bg-tertiary);
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: var(--accent-primary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.75rem;
          border-bottom: 2px solid var(--accent-primary);
        }
        
        td {
          padding: 0.75rem;
          border-bottom: 1px solid var(--border);
        }
        
        tr:hover {
          background: var(--bg-tertiary);
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        @media (max-width: 768px) {
          .app-header {
            padding: 1rem;
          }
          
          .app-title h1 {
            font-size: 1rem;
          }
          
          .wizard-steps {
            flex-direction: column;
          }
          
          .wizard-step {
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .main-content {
            padding: 1rem;
          }
        }
      `}</style>

      <header className="app-header">
        <div className="header-content">
          <div className="app-title">
            <Calculator size={32} color="var(--accent-primary)" />
            <div>
              <h1>BETON REÇETE SİSTEMİ</h1>
              <span className="version">v2.0 PRO</span>
            </div>
          </div>
          <nav className="header-nav">
            <button className="btn btn-secondary" onClick={() => setCurrentView('home')}>
              Ana Sayfa
            </button>
            <button className="btn btn-secondary" onClick={() => setCurrentView('settings')}>
              <Settings size={16} />
              Ayarlar
            </button>
            <button className="btn btn-primary" onClick={() => setCurrentView('new')}>
              <Plus size={16} />
              Yeni Proje
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {currentView === 'home' && <HomeView setCurrentView={setCurrentView} projects={projects} />}
        {currentView === 'new' && (
          <WizardView 
            formData={formData} 
            setFormData={setFormData}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            calculations={calculations}
            config={config}
            saveProject={saveProject}
            setCurrentView={setCurrentView}
          />
        )}
        {currentView === 'settings' && (
          <SettingsView config={config} saveConfig={saveConfig} />
        )}
      </main>
    </div>
  );
}

// ==================== HOME VIEW ====================
function HomeView({ setCurrentView, projects }) {
  return (
    <div className="home-container fade-in">
      <div className="home-card" onClick={() => setCurrentView('new')}>
        <Plus size={48} color="var(--accent-primary)" style={{marginBottom: '1rem'}} />
        <h2>Yeni Proje</h2>
        <p>
          Yeni bir beton reçete tasarımı başlatın. C8/10'dan C80/95'e kadar tüm beton sınıfları 
          ve 21 farklı çevre etki sınıfı desteği.
        </p>
      </div>

      <div className="home-card">
        <Download size={48} color="var(--accent-secondary)" style={{marginBottom: '1rem'}} />
        <h2>Kayıtlı Projeler</h2>
        <p>
          {projects.length} adet kayıtlı projeniz bulunmaktadır. 
          Geçmiş çalışmalarınıza göz atın ve düzenleyin.
        </p>
      </div>

      <div className="home-card" onClick={() => setCurrentView('settings')}>
        <Settings size={48} color="var(--warning)" style={{marginBottom: '1rem'}} />
        <h2>Standart Yönetimi</h2>
        <p>
          Beton sınıfları, çevre etki parametreleri ve pompa sınırlarını 
          güncelleyin. Yeni standartlara uyum sağlayın.
        </p>
      </div>
    </div>
  );
}

// ==================== WIZARD VIEW ====================
function WizardView({ formData, setFormData, currentStep, setCurrentStep, calculations, config, saveProject, setCurrentView }) {
  const steps = [
    { id: 1, title: 'Proje', desc: 'Temel Bilgiler' },
    { id: 2, title: 'Malzeme', desc: 'Çimento & Katkılar' },
    { id: 3, title: 'Agrega', desc: 'Özellikler' },
    { id: 4, title: 'Gradasyon', desc: 'Karışım & Elek' },
    { id: 5, title: 'Reçete', desc: 'Sonuç' }
  ];

  const handleSave = () => {
    const project = {
      id: Date.now(),
      ...formData,
      calculations,
      createdAt: new Date().toISOString()
    };
    saveProject(project);
    alert('Proje başarıyla kaydedildi!');
    setCurrentView('home');
  };

  return (
    <div className="wizard-container fade-in">
      <div className="wizard-steps">
        {steps.map(step => (
          <div 
            key={step.id}
            className={`wizard-step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
            onClick={() => setCurrentStep(step.id)}
          >
            <div className="step-number">
              {currentStep > step.id ? <CheckCircle size={16} /> : step.id}
            </div>
            <div className="step-label">
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="wizard-content">
        {currentStep === 1 && <Step1Project formData={formData} setFormData={setFormData} config={config} calculations={calculations} />}
        {currentStep === 2 && <Step2Materials formData={formData} setFormData={setFormData} calculations={calculations} />}
        {currentStep === 3 && <Step3Aggregates formData={formData} setFormData={setFormData} calculations={calculations} />}
        {currentStep === 4 && <Step4Gradation formData={formData} setFormData={setFormData} calculations={calculations} config={config} />}
        {currentStep === 5 && <Step5Recipe formData={formData} calculations={calculations} />}

        <div className="wizard-actions">
          <button 
            className="btn btn-secondary" 
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Geri
          </button>
          <div style={{display: 'flex', gap: '1rem'}}>
            {currentStep === 5 && (
              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={16} />
                Kaydet
              </button>
            )}
            {currentStep < 5 && (
              <button 
                className="btn btn-primary" 
                onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
              >
                İleri
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== STEP 1: PROJECT ====================
function Step1Project({ formData, setFormData, config, calculations }) {
  return (
    <div>
      <div className="form-section">
        <h3>Proje Bilgileri</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Proje Adı</label>
            <input 
              type="text" 
              value={formData.projectName}
              onChange={e => setFormData({...formData, projectName: e.target.value})}
              placeholder="Örn: Köprü Projesi 2025"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Beton Sınıfı</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Sınıf Seçimi</label>
            <select 
              value={formData.concreteClass}
              onChange={e => setFormData({...formData, concreteClass: e.target.value})}
            >
              {config.concreteClasses.map(c => (
                <option key={c.id} value={c.id}>{c.id}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="result-card">
          <h4>Seçilen Sınıf Özellikleri</h4>
          <div className="result-grid">
            <div className="result-item">
              <span className="result-label">fck (Karakteristik)</span>
              <span className="result-value">{calculations.concreteClass?.fck} MPa</span>
            </div>
            <div className="result-item">
              <span className="result-label">fcm (Hedef)</span>
              <span className="result-value">{calculations.concreteClass?.fcm} MPa</span>
            </div>
            <div className="result-item">
              <span className="result-label">Standart Sapma</span>
              <span className="result-value">{calculations.concreteClass?.stdDev} MPa</span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Çevre Etki Sınıfı</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Etki Sınıfı</label>
            <select 
              value={formData.envClass}
              onChange={e => setFormData({...formData, envClass: e.target.value})}
            >
              {config.environmentalClasses.map(e => (
                <option key={e.id} value={e.id}>{e.id} - {e.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="result-card">
          <h4>Çevre Etki Kısıtları</h4>
          <div className="result-grid">
            <div className="result-item">
              <span className="result-label">Max s/ç Oranı</span>
              <span className="result-value">{calculations.envClass?.maxWC || '-'}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Min Çimento</span>
              <span className="result-value">{calculations.envClass?.minCement || '-'} kg/m³</span>
            </div>
            <div className="result-item">
              <span className="result-label">Min Hava İçeriği</span>
              <span className="result-value">{calculations.envClass?.minAir || '-'} %</span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Kıvam Özellikleri</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Çökme Sınıfı</label>
            <select 
              value={formData.slump}
              onChange={e => setFormData({...formData, slump: e.target.value})}
            >
              <option value="S1">S1 (10-40 mm)</option>
              <option value="S2">S2 (50-90 mm)</option>
              <option value="S3">S3 (100-150 mm)</option>
              <option value="S4">S4 (160-210 mm)</option>
              <option value="S5">S5 (≥220 mm)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Hedef s/ç Oranı</label>
            <input 
              type="number" 
              step="0.01"
              value={formData.targetWC}
              onChange={e => setFormData({...formData, targetWC: parseFloat(e.target.value)})}
            />
          </div>
        </div>

        <div className="result-card">
          <h4>Uyumluluk Kontrolü</h4>
          <div className="result-grid">
            <div className="result-item">
              <span className="result-label">Seçilen s/ç</span>
              <span className="result-value">{calculations.wc.toFixed(2)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Durum</span>
              <span className={`status-badge ${calculations.wc <= (calculations.envClass?.maxWC || 1) ? 'status-success' : 'status-danger'}`}>
                {calculations.wc <= (calculations.envClass?.maxWC || 1) ? (
                  <><CheckCircle size={14} /> UYGUN</>
                ) : (
                  <><AlertCircle size={14} /> DİKKAT</>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== STEP 2: MATERIALS ====================
function Step2Materials({ formData, setFormData, calculations }) {
  return (
    <div>
      <div className="form-section">
        <h3>Karışım Suyu</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Su Miktarı (kg/m³)</label>
            <input 
              type="number"
              value={formData.water}
              onChange={e => setFormData({...formData, water: parseFloat(e.target.value)})}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Çimento Özellikleri</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Çimento Tipi</label>
            <input 
              type="text"
              value={formData.cementType}
              onChange={e => setFormData({...formData, cementType: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Yoğunluk (kg/dm³)</label>
            <input 
              type="number"
              step="0.01"
              value={formData.cementDensity}
              onChange={e => setFormData({...formData, cementDensity: parseFloat(e.target.value)})}
            />
          </div>
        </div>

        <div className="result-card">
          <h4>Çimento Miktarı Hesabı</h4>
          <div className="result-grid">
            <div className="result-item">
              <span className="result-label">Hesaplanan</span>
              <span className="result-value">{calculations.cement.toFixed(1)} kg/m³</span>
            </div>
            <div className="result-item">
              <span className="result-label">Min Gerekli</span>
              <span className="result-value">{calculations.envClass?.minCement || '-'} kg/m³</span>
            </div>
            <div className="result-item">
              <span className="result-label">Durum</span>
              <span className={`status-badge ${calculations.cement >= (calculations.envClass?.minCement || 0) ? 'status-success' : 'status-warning'}`}>
                {calculations.cement >= (calculations.envClass?.minCement || 0) ? (
                  <><CheckCircle size={14} /> UYGUN</>
                ) : (
                  <><AlertCircle size={14} /> ARTTIRILDI</>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Kimyasal Katkı</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Dozaj (% çimento)</label>
            <input 
              type="number"
              step="0.1"
              value={formData.admixturePercentage}
              onChange={e => setFormData({...formData, admixturePercentage: parseFloat(e.target.value)})}
            />
          </div>
          <div className="form-group">
            <label>Yoğunluk (kg/dm³)</label>
            <input 
              type="number"
              step="0.01"
              value={formData.admixtureDensity}
              onChange={e => setFormData({...formData, admixtureDensity: parseFloat(e.target.value)})}
            />
          </div>
        </div>

        <div className="result-card">
          <h4>Katkı Miktarı (Otomatik)</h4>
          <div className="result-grid">
            <div className="result-item">
              <span className="result-label">Kimyasal Katkı</span>
              <span className="result-value">{calculations.admixture.toFixed(2)} kg/m³</span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Hava Sürükleyici</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Kullanım</label>
            <select 
              value={formData.useAirEntraining}
              onChange={e => setFormData({...formData, useAirEntraining: e.target.value === 'true'})}
            >
              <option value="false">Kullanılmıyor</option>
              <option value="true">Kullanılıyor</option>
            </select>
          </div>
        </div>

        {formData.useAirEntraining && (
          <div className="result-card">
            <h4>Hava İçeriği</h4>
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">Hedef Hava</span>
                <span className="result-value">{calculations.airContent.toFixed(1)} %</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== STEP 3: AGGREGATES ====================
function Step3Aggregates({ formData, setFormData, calculations }) {
  const updateAggregate = (index, field, value) => {
    const updated = [...formData.aggregates];
    updated[index] = {...updated[index], [field]: parseFloat(value)};
    setFormData({...formData, aggregates: updated});
  };

  return (
    <div>
      <div className="form-section">
        <h3>Agrega Özellikleri</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Tane Sınıfı</th>
                <th>Yoğunluk (kg/dm³)</th>
                <th>Su Emme (%)</th>
                <th>Rutubet (%)</th>
                <th>Se-R</th>
              </tr>
            </thead>
            <tbody>
              {formData.aggregates.map((agg, i) => (
                <tr key={agg.id}>
                  <td><strong>{agg.name}</strong></td>
                  <td>
                    <input 
                      type="number" 
                      step="0.01"
                      value={agg.density}
                      onChange={e => updateAggregate(i, 'density', e.target.value)}
                      style={{width: '100px'}}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      step="0.1"
                      value={agg.absorption}
                      onChange={e => updateAggregate(i, 'absorption', e.target.value)}
                      style={{width: '100px'}}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      step="0.1"
                      value={agg.moisture}
                      onChange={e => updateAggregate(i, 'moisture', e.target.value)}
                      style={{width: '100px'}}
                    />
                  </td>
                  <td>
                    <span style={{color: 'var(--accent-primary)', fontWeight: 'bold'}}>
                      {(agg.absorption - agg.moisture).toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="result-card">
        <h4>Ağırlıklı Ortalama Yoğunluk</h4>
        <div className="result-grid">
          <div className="result-item">
            <span className="result-label">ρa (Kombine)</span>
            <span className="result-value">{calculations.aggregateDensity.toFixed(3)} kg/dm³</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== STEP 4: GRADATION ====================
function Step4Gradation({ formData, setFormData, calculations, config }) {
  const updateRatio = (index, value) => {
    const updated = [...formData.aggregateRatios];
    updated[index] = parseFloat(value) || 0;
    setFormData({...formData, aggregateRatios: updated});
  };

  const totalRatio = formData.aggregateRatios.reduce((a, b) => a + b, 0);

  const chartData = calculations.combinedGradation.map(point => {
    const limit = config.pumpGradationLimits.find(l => l.sieve === point.sieve);
    return {
      sieve: point.sieve,
      passing: point.passing,
      min: limit?.min,
      max: limit?.max
    };
  });

  return (
    <div>
      <div className="form-section">
        <h3>Karışım Oranları</h3>
        <div className="form-grid">
          {formData.aggregates.map((agg, i) => (
            <div key={agg.id} className="form-group">
              <label>{agg.name} (%)</label>
              <input 
                type="number"
                value={formData.aggregateRatios[i]}
                onChange={e => updateRatio(i, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="result-card">
          <h4>Toplam Kontrol</h4>
          <div className="result-grid">
            <div className="result-item">
              <span className="result-label">Toplam</span>
              <span className="result-value">{totalRatio.toFixed(0)} %</span>
            </div>
            <div className="result-item">
              <span className="result-label">Durum</span>
              <span className={`status-badge ${totalRatio === 100 ? 'status-success' : 'status-warning'}`}>
                {totalRatio === 100 ? (
                  <><CheckCircle size={14} /> TAMAM</>
                ) : (
                  <><AlertCircle size={14} /> 100 OLMALI</>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h4 style={{marginBottom: '1rem', color: 'var(--accent-primary)'}}>KOMBİNE GRADASYON EĞRİSİ</h4>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey="sieve" 
              stroke="var(--text-secondary)"
              label={{ value: 'Elek Açıklığı (mm)', position: 'insideBottom', offset: -5, fill: 'var(--text-secondary)' }}
            />
            <YAxis 
              stroke="var(--text-secondary)"
              label={{ value: 'Geçen %', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)' }}
            />
            <Tooltip 
              contentStyle={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--text-primary)'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="min" stroke="var(--warning)" strokeWidth={2} name="Min Sınır" dot={false} />
            <Line type="monotone" dataKey="max" stroke="var(--warning)" strokeWidth={2} name="Max Sınır" dot={false} />
            <Line type="monotone" dataKey="passing" stroke="var(--accent-primary)" strokeWidth={3} name="Kombine Eğri" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="result-card">
        <h4>Pompa Uyumluluk Kontrolü</h4>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Elek (mm)</th>
                <th>Geçen %</th>
                <th>Min</th>
                <th>Max</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map(point => {
                const isValid = point.passing >= point.min && point.passing <= point.max;
                return (
                  <tr key={point.sieve}>
                    <td><strong>{point.sieve}</strong></td>
                    <td>{point.passing.toFixed(1)}</td>
                    <td>{point.min}</td>
                    <td>{point.max}</td>
                    <td>
                      <span className={`status-badge ${isValid ? 'status-success' : 'status-danger'}`}>
                        {isValid ? '✓' : '✗'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================== STEP 5: RECIPE ====================
function Step5Recipe({ formData, calculations }) {
  const dryRecipe = [
    { name: 'Çimento', value: calculations.cement, unit: 'kg/m³' },
    { name: 'Su', value: formData.water, unit: 'kg/m³' },
    { name: 'Kimyasal Katkı', value: calculations.admixture, unit: 'kg/m³' },
    ...formData.aggregates.map((agg, i) => ({
      name: agg.name,
      value: calculations.aggregateAmounts[i],
      unit: 'kg/m³'
    }))
  ];

  const moistRecipe = [
    { name: 'Çimento', value: calculations.cement, unit: 'kg/m³' },
    { name: 'Su (Düzeltilmiş)', value: calculations.adjustedWater, unit: 'kg/m³' },
    { name: 'Kimyasal Katkı', value: calculations.admixture, unit: 'kg/m³' },
    ...calculations.moistureCorrection.correctedAggregates.map(agg => ({
      name: agg.name,
      value: agg.moistAmount,
      unit: 'kg/m³'
    }))
  ];

  const trial25L = moistRecipe.map(item => ({
    ...item,
    value: item.value * 0.025
  }));

  const trial50L = moistRecipe.map(item => ({
    ...item,
    value: item.value * 0.050
  }));

  return (
    <div>
      <div className="form-section">
        <h3>DKY Reçetesi (1 m³)</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Malzeme</th>
                <th>Miktar</th>
                <th>Birim</th>
              </tr>
            </thead>
            <tbody>
              {dryRecipe.map((item, i) => (
                <tr key={i}>
                  <td><strong>{item.name}</strong></td>
                  <td style={{textAlign: 'right', color: 'var(--accent-primary)', fontWeight: 'bold'}}>
                    {item.value.toFixed(2)}
                  </td>
                  <td>{item.unit}</td>
                </tr>
              ))}
              <tr style={{borderTop: '2px solid var(--accent-primary)'}}>
                <td><strong>TOPLAM</strong></td>
                <td style={{textAlign: 'right', color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '1.1rem'}}>
                  {dryRecipe.reduce((sum, item) => sum + item.value, 0).toFixed(1)}
                </td>
                <td>kg/m³</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="form-section">
        <h3>Rutubetli Reçete (1 m³)</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Malzeme</th>
                <th>Miktar</th>
                <th>Birim</th>
              </tr>
            </thead>
            <tbody>
              {moistRecipe.map((item, i) => (
                <tr key={i}>
                  <td><strong>{item.name}</strong></td>
                  <td style={{textAlign: 'right', color: 'var(--accent-primary)', fontWeight: 'bold'}}>
                    {item.value.toFixed(2)}
                  </td>
                  <td>{item.unit}</td>
                </tr>
              ))}
              <tr style={{borderTop: '2px solid var(--accent-primary)'}}>
                <td><strong>TOPLAM</strong></td>
                <td style={{textAlign: 'right', color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '1.1rem'}}>
                  {moistRecipe.reduce((sum, item) => sum + item.value, 0).toFixed(1)}
                </td>
                <td>kg/m³</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="form-section">
        <h3>Deneme Dökümü</h3>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
          <div>
            <h4 style={{color: 'var(--accent-secondary)', marginBottom: '1rem'}}>25 Litre</h4>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Malzeme</th>
                    <th>Miktar (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {trial25L.map((item, i) => (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td style={{textAlign: 'right', color: 'var(--accent-primary)'}}>
                        {item.value.toFixed(3)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 style={{color: 'var(--accent-secondary)', marginBottom: '1rem'}}>50 Litre</h4>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Malzeme</th>
                    <th>Miktar (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {trial50L.map((item, i) => (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td style={{textAlign: 'right', color: 'var(--accent-primary)'}}>
                        {item.value.toFixed(3)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="result-card">
        <h4>Reçete Özeti</h4>
        <div className="result-grid">
          <div className="result-item">
            <span className="result-label">Beton Sınıfı</span>
            <span className="result-value">{formData.concreteClass}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Çevre Etki</span>
            <span className="result-value">{formData.envClass}</span>
          </div>
          <div className="result-item">
            <span className="result-label">s/ç Oranı</span>
            <span className="result-value">{calculations.wc.toFixed(2)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Çimento</span>
            <span className="result-value">{calculations.cement.toFixed(0)} kg/m³</span>
          </div>
          <div className="result-item">
            <span className="result-label">Hava %</span>
            <span className="result-value">{calculations.airContent.toFixed(1)} %</span>
          </div>
          <div className="result-item">
            <span className="result-label">Toplam Agrega</span>
            <span className="result-value">{calculations.totalAggregate.toFixed(0)} kg/m³</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== SETTINGS VIEW ====================
function SettingsView({ config, saveConfig }) {
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState(null);

  const startEdit = (type, item) => {
    setEditMode(type);
    setEditData({...item});
  };

  const saveEdit = () => {
    if (editMode === 'concrete') {
      const updated = config.concreteClasses.map(c => 
        c.id === editData.id ? editData : c
      );
      saveConfig({...config, concreteClasses: updated});
    } else if (editMode === 'env') {
      const updated = config.environmentalClasses.map(e => 
        e.id === editData.id ? editData : e
      );
      saveConfig({...config, environmentalClasses: updated});
    }
    setEditMode(null);
    setEditData(null);
  };

  const addNew = (type) => {
    if (type === 'concrete') {
      const newClass = {
        id: `C${prompt('Beton sınıfı (örn: C90/105):')}`,
        fck: parseFloat(prompt('fck değeri:')),
        fcm: parseFloat(prompt('fcm değeri:')),
        stdDev: parseFloat(prompt('Standart sapma:'))
      };
      saveConfig({...config, concreteClasses: [...config.concreteClasses, newClass]});
    } else if (type === 'env') {
      const newEnv = {
        id: prompt('Etki sınıfı (örn: XD4):'),
        name: prompt('Açıklama:'),
        maxWC: parseFloat(prompt('Max s/ç:')) || null,
        minCement: parseFloat(prompt('Min çimento:')) || null,
        minAir: parseFloat(prompt('Min hava %:')) || null
      };
      saveConfig({...config, environmentalClasses: [...config.environmentalClasses, newEnv]});
    }
  };

  return (
    <div className="fade-in">
      <div className="form-section">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h3>Beton Sınıfları</h3>
          <button className="btn btn-primary" onClick={() => addNew('concrete')}>
            <Plus size={16} />
            Yeni Ekle
          </button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Sınıf</th>
                <th>fck (MPa)</th>
                <th>fcm (MPa)</th>
                <th>Std Sapma</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {config.concreteClasses.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.id}</strong></td>
                  <td>{c.fck}</td>
                  <td>{c.fcm}</td>
                  <td>{c.stdDev}</td>
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      style={{padding: '0.5rem 1rem'}}
                      onClick={() => startEdit('concrete', c)}
                    >
                      <Edit size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="form-section">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h3>Çevre Etki Sınıfları</h3>
          <button className="btn btn-primary" onClick={() => addNew('env')}>
            <Plus size={16} />
            Yeni Ekle
          </button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Sınıf</th>
                <th>Açıklama</th>
                <th>Max s/ç</th>
                <th>Min Çimento</th>
                <th>Min Hava</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {config.environmentalClasses.map(e => (
                <tr key={e.id}>
                  <td><strong>{e.id}</strong></td>
                  <td>{e.name}</td>
                  <td>{e.maxWC || '-'}</td>
                  <td>{e.minCement || '-'}</td>
                  <td>{e.minAir || '-'}</td>
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      style={{padding: '0.5rem 1rem'}}
                      onClick={() => startEdit('env', e)}
                    >
                      <Edit size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editMode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%'
          }}>
            <h3 style={{marginBottom: '1.5rem', color: 'var(--accent-primary)'}}>Düzenle</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {Object.keys(editData).map(key => (
                <div key={key} className="form-group">
                  <label>{key}</label>
                  <input 
                    type={typeof editData[key] === 'number' ? 'number' : 'text'}
                    value={editData[key] || ''}
                    onChange={e => setEditData({...editData, [key]: e.target.value})}
                  />
                </div>
              ))}
            </div>
            <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
              <button className="btn btn-secondary" onClick={() => setEditMode(null)}>
                İptal
              </button>
              <button className="btn btn-primary" onClick={saveEdit}>
                <Save size={16} />
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
