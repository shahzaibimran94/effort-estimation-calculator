import { Injectable, EventEmitter } from '@angular/core';
import { DATA } from './mock-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  appType: string;
  appName: string;
  currentStep = 1;
  platformSelected: string;
  featuresSelected = [];
  selectedTileDetail: any;
  currentStepDetail: any;
  designSelected: string;
  devHours: number = 0;
  nonDevHours: number = 0;
  nonDevHoursObj = { min: 0, max: 0 };
  designHours: number = 0;
  designHoursObj = { min: 0, max: 0 };
  totalHoursObj = { min: 0, max: 0 };
  currentStepHours: number = 0;

  costForSelectedApp = {
    existing: { uber: { min: 33.475 , max: 33.4825 } },
    business: { shopping: { min: 33.475 , max: 33.4825 } }
  }
  
  featureRemoved = new EventEmitter<number>();
  showFeatureDetail = new EventEmitter<boolean>();
  constructor(private http: HttpClient) { }

  getServerEstimates(uid: string) {
    const form = new FormData();
    form.append('url', 'fetch_estimate');
    form.append('uid', uid);
    return this.http.post<any>('https://exemplarymarketing.com/calc_api/index.php', form);
  }

  sendEmailWithEstimate(email: string) {
    const uid = String((new Date()).getTime()) + 'REPORT';
    const { e, o } = this.getTotalHoursDetail();
    const estimate = {
      appName: this.appName,
      designSelected: this.designSelected,
      e,
      o,
      featuresSelected: this.featuresSelected
    };
    const form = new FormData();
    form.append('url', 'store_estimate');
    form.append('uid', uid);
    form.append('estimate', JSON.stringify(estimate));
    form.append('email', email);
    return this.http.post<any>('https://exemplarymarketing.com/calc_api/index.php', form);
  }

  setSteps(): void {
    this.selectedTileDetail = this.appType && this.appName ? DATA._json[this.appType][this.appName.toLowerCase()] : [];
  }

  getNextStepDetail(): any {
    return this.selectedTileDetail[this.currentStep-2];
  }

  addOrRemoveSubFeature(feature_id, apply): void {
    const features = this.currentStepDetail.features;
    this.currentStepDetail.features = [];
    for (const f of features) {
      if (f.id === feature_id) {
        this.currentStepDetail.features.push({...f, isSelected: apply});
        if (apply) {
          this.devHours += f.hrs; 
        } else {
          this.devHours -= f.hrs;
        }
      } else {
        this.currentStepDetail.features.push(f);
      }
    }
    this.devHours = +(this.devHours).toFixed(1);
    this.calculateNonDevHours();
  }

  setCurrentStepDetail(): void {
    const currStepDetail = {...this.selectedTileDetail[this.currentStep-2]};
    if (currStepDetail && currStepDetail.features) {
      const newFeaturesArr = [];
      for (const feature of currStepDetail.features) {
        const featureWithTotal = {...feature};
        featureWithTotal['hrs'] = 0;
        if (this.platformSelected === 'Android') {
          featureWithTotal['hrs'] += feature.androidMin + feature.androidMax  
        } else if (this.platformSelected === 'iOS') {
          featureWithTotal['hrs'] += feature.iosMin + feature.iosMax;
        } else if (this.platformSelected === 'Both') {
          featureWithTotal['hrs'] += (feature.androidMin + feature.androidMax) + (feature.iosMin + feature.iosMax);
        }
        featureWithTotal['hrs'] += feature.webMin + feature.webMax;
        if (featureWithTotal['hrs'] > 0) {
          featureWithTotal['hrs'] = +((featureWithTotal['hrs'] / 2).toFixed(1));
        }
        if (feature.isMvp) {
          featureWithTotal['isSelected'] = feature.isMvp;
        } else { 
          featureWithTotal['isSelected'] = false; 
        }
        newFeaturesArr.push(featureWithTotal);
      }
      currStepDetail.features = newFeaturesArr;
      this.currentStepDetail = currStepDetail;
      const total = this.currentStepDetail.features.reduce((total, f) => {
        if (f.isMvp) {
          if (this.platformSelected === 'Android') {
            total += f.androidMin + f.androidMax;
          } else if (this.platformSelected === 'iOS') {
            total += f.iosMin + f.iosMax;
          } else if (this.platformSelected === 'Both') {
            total += (f.androidMin + f.androidMax) + (f.iosMin + f.iosMax);
          }
          total += f.webMin + f.webMax;
        }
        return total;
      }, 0);
      this.currentStepHours = total ? +((total/2).toFixed(1)) : 0;
    }
  }

  minusHoursOnFeatureRemove(feature_id: number): void {
    const featureData = this.featuresSelected.find(f => f.id === feature_id);
    if (featureData) {
      const total = featureData.features.reduce((total, f) => {
        if (f.isSelected) {
          if (this.platformSelected === 'Android') {
            total += f.androidMin + f.androidMax;
          } else if (this.platformSelected === 'iOS') {
            total += f.iosMin + f.iosMax;
          } else if (this.platformSelected === 'Both') {
            total += (f.androidMin + f.androidMax) + (f.iosMin + f.iosMax);
          }
          total += f.webMin + f.webMax;
        }
        return total;
      }, 0);
      const hoursToDeduct = total ? +((total/2).toFixed(1)) : 0;
      this.devHours = +(this.devHours - hoursToDeduct).toFixed(1);
    }
    this.featuresSelected = this.featuresSelected.filter(f => f.id !== feature_id);
    this.calculateNonDevHours();
    this.setDesignHours();
  }

  updateHrs(id = null) {
    if (this.currentStepDetail && this.currentStepDetail.features) {
      this.currentStepDetail.features.map(f => {
        f.hrs = 0;
        if (this.platformSelected === 'Android') {
          f['hrs'] += f.androidMin + f.androidMax  
        } else if (this.platformSelected === 'iOS') {
          f['hrs'] += f.iosMin + f.iosMax;
        } else if (this.platformSelected === 'Both') {
          f['hrs'] += (f.androidMin + f.androidMax) + (f.iosMin + f.iosMax);
        }
        f['hrs'] += f.webMin + f.webMax;
        if (f['hrs'] > 0) {
          f['hrs'] = +((f['hrs'] / 2).toFixed(1));
        }
        return f;
      });
    }
    let newTotal = 0;
    for (let featureSelected of this.featuresSelected) {
      const total = featureSelected.features.reduce((total, f) => {
        if (f.isSelected) {
          if (this.platformSelected === 'Android') {
            total += f.androidMin + f.androidMax;
          } else if (this.platformSelected === 'iOS') {
            total += f.iosMin + f.iosMax;
          } else if (this.platformSelected === 'Both') {
            total += (f.androidMin + f.androidMax) + (f.iosMin + f.iosMax);
          }
          total += f.webMin + f.webMax;
        }
        return total;
      }, 0);
      const hoursToAdd = total ? +((total/2).toFixed(1)) : 0;
      newTotal += hoursToAdd;
    }
    this.devHours = newTotal;
  }

  calculateNonDevHours() {
    this.totalHoursObj = { min: 0, max: 0 };
    this.nonDevHoursObj = { min: 0, max: 0 };
    this.designHoursObj = { min: 0, max: 0 };
    let a = 2;
    const i = { min: 0, max: 0 };
    const e = {
      android: { min: 0, max: 0 },
      ios: { min: 0, max: 0 },
      web: { min: 0, max: 0 },
      design: { min: 0, max: 0 }
    };
    const t = {
      architecture: {
        android: { min: 20, max: 24 },
        ios: { min: 20, max: 24 },
        web: { min: 0, max: 0 }
      },
      projectSetup: {
        android: { min: 3, max: 5 },
        ios: { min: 3, max: 5 },
        web: { min: 2, max: 3 }
      },
      continuousIntegration: { min: 0.5, max: 1 },
      continuousDelivery: { min: 1, max: 2 }
    }
    const o = {
      projectSetup: { min: 0, max: 0 },
      architecture: { min: 0, max: 0 },
      database: { min: 0, max: 0 },
      network: { min: 0, max: 0 },
      swagger: { min: 0, max: 0 },
      meetingsTime: { min: 0, max: 0 },
      meetingsAmount: { min: 0, max: 0 },
      numberOfSprints: 0,
      continuousIntegration: { min: 0, max: 0 },
      continuousDelivery: { min: 0, max: 0 },
      releasePerSprint: { min: 0, max: 0 },
      releaseToProduction: { min: 0, max: 0 },
    };
    if (this.featuresSelected.length > 0 && this.platformSelected) {
      for (let selected of this.featuresSelected) {
        for (let feature of selected.features) {
          if (feature.isSelected) {
            switch (this.platformSelected) {
              case 'Android':
                e.android.min += feature.androidMin;
                e.android.max += feature.androidMax;
                break;
              case 'iOS':
                e.ios.min += feature.iosMin;
                e.ios.max += feature.iosMax;
                break;
              case 'Both':
                e.android.min += feature.androidMin;
                e.android.max += feature.androidMax;
                e.ios.min += feature.iosMin;
                e.ios.max += feature.iosMax;
                break;
            }
            e.web.min += feature.webMin;
            e.web.max += feature.webMax;
            e.design.min += feature.designMin;
            e.design.max += feature.designMax;
          }
        }
      }

      o.projectSetup.min = t.projectSetup.web.min,
      o.projectSetup.max = t.projectSetup.web.max,
      o.continuousIntegration = t.continuousIntegration,
      o.continuousDelivery = t.continuousDelivery
      switch (this.platformSelected) {
        case 'Android':
            o.projectSetup.min += t.projectSetup.android.min,
            o.projectSetup.max += t.projectSetup.android.max,
            o.architecture.min += t.architecture.android.min,
            o.architecture.max += t.architecture.android.max,
            i.min = e.android.min;
            i.max = e.android.max;
            break;
        case 'iOS':
            o.projectSetup.min += t.projectSetup.ios.min,
            o.projectSetup.max += t.projectSetup.ios.max,
            o.architecture.min += t.architecture.ios.min,
            o.architecture.max += t.architecture.ios.max,
            i.min = e.ios.min;
            i.max = e.ios.max;
            break;
        case 'Both':
            o.projectSetup.min += t.projectSetup.android.min + t.projectSetup.ios.min,
            o.projectSetup.max += t.projectSetup.android.max + t.projectSetup.ios.max,
            o.architecture.min += t.architecture.android.min + t.architecture.ios.min,
            o.architecture.max += t.architecture.android.max + t.architecture.ios.max,
            i.min = e.android.min + e.ios.min,
            i.max = e.android.max + e.ios.max;
            a = 3
        }
      o.database = { min: (e.web.min + i.min)*0.1, max: (e.web.max + i.max)*0.1 };
      o.network = { min: i.min*0.09, max: i.max*0.09 };
      o.swagger = { min: e.web.min*0.1, max: e.web.max*0.1 };
      o.numberOfSprints = Math.max((e.web.min+e.web.max)/2, (e.android.min+e.android.max)/2, (e.ios.min+e.ios.max)/2) / 70;
      o.meetingsTime = { min: a * o.numberOfSprints * 2.5, max: a * o.numberOfSprints * 5 };
      o.releasePerSprint = { min: 2 * o.numberOfSprints, max: 3 * o.numberOfSprints };
      o.releaseToProduction = { min: 4 * a, max: 5 * a };
      o.meetingsAmount = { min: 6 * o.numberOfSprints, max: 10 * o.numberOfSprints }
    }
    let total = { min: 0, max: 0 };
    for (let k in o) {
      if (k !== 'numberOfSprints' && k !== 'meetingsAmount') {
        total.min += o[k].min;
        total.max += o[k].max;
      }
    }
    if (total.min > 0 && total.max > 0) {
      this.nonDevHours = +(((total.min + total.max)/2).toFixed(1));
      this.nonDevHoursObj = total;
      this.designHoursObj.min = e.design.min;
      this.designHoursObj.max = e.design.max;
      switch (this.platformSelected) {
        case 'Android':
          this.totalHoursObj.min = e.android.min;
          this.totalHoursObj.max = e.android.max;
          break;
        case 'iOS':
          this.totalHoursObj.min = e.ios.min;
          this.totalHoursObj.max = e.ios.max;
          break;
        case 'Both':
          this.totalHoursObj.min = e.android.min + e.ios.min;
          this.totalHoursObj.max = e.android.max + e.ios.max;
          break;
      }
      this.totalHoursObj.min += e.web.min;
      this.totalHoursObj.max += e.web.max;
    } else {
      this.nonDevHours = 0;
    };
  }

  getTotalHoursDetail() {
    let a = 2;
    const i = { min: 0, max: 0 };
    const e = {
      android: { min: 0, max: 0 },
      ios: { min: 0, max: 0 },
      web: { min: 0, max: 0 },
      design: { min: 0, max: 0 }
    };
    const t = {
      architecture: {
        android: { min: 20, max: 24 },
        ios: { min: 20, max: 24 },
        web: { min: 0, max: 0 }
      },
      projectSetup: {
        android: { min: 3, max: 5 },
        ios: { min: 3, max: 5 },
        web: { min: 2, max: 3 }
      },
      continuousIntegration: { min: 0.5, max: 1 },
      continuousDelivery: { min: 1, max: 2 }
    }
    const o = {
      projectSetup: { min: 0, max: 0 },
      architecture: { min: 0, max: 0 },
      database: { min: 0, max: 0 },
      network: { min: 0, max: 0 },
      swagger: { min: 0, max: 0 },
      meetingsTime: { min: 0, max: 0 },
      meetingsAmount: { min: 0, max: 0 },
      numberOfSprints: 0,
      continuousIntegration: { min: 0, max: 0 },
      continuousDelivery: { min: 0, max: 0 },
      releasePerSprint: { min: 0, max: 0 },
      releaseToProduction: { min: 0, max: 0 },
    };
    for (let selected of this.featuresSelected) {
      for (let feature of selected.features) {
        if (feature.isSelected) {
          switch (this.platformSelected) {
            case 'Android':
              e.android.min += feature.androidMin;
              e.android.max += feature.androidMax;
              break;
            case 'iOS':
              e.ios.min += feature.iosMin;
              e.ios.max += feature.iosMax;
              break;
            case 'Both':
                e.android.min += feature.androidMin;
                e.android.max += feature.androidMax;
                e.ios.min += feature.iosMin;
                e.ios.max += feature.iosMax;
                break;
          }
          e.web.min += feature.webMin;
          e.web.max += feature.webMax;
          e.design.min += feature.designMin;
          e.design.max += feature.designMax;
        }
      }
    }

    o.projectSetup.min = t.projectSetup.web.min,
    o.projectSetup.max = t.projectSetup.web.max,
    o.continuousIntegration = t.continuousIntegration,
    o.continuousDelivery = t.continuousDelivery
    switch (this.platformSelected) {
      case 'Android':
          o.projectSetup.min += t.projectSetup.android.min,
          o.projectSetup.max += t.projectSetup.android.max,
          o.architecture.min += t.architecture.android.min,
          o.architecture.max += t.architecture.android.max,
          i.min = e.android.min;
          i.max = e.android.max;
          break;
      case 'iOS':
          o.projectSetup.min += t.projectSetup.ios.min,
          o.projectSetup.max += t.projectSetup.ios.max,
          o.architecture.min += t.architecture.ios.min,
          o.architecture.max += t.architecture.ios.max,
          i.min = e.ios.min;
          i.max = e.ios.max;
          break;
      case 'Both':
          o.projectSetup.min += t.projectSetup.android.min + t.projectSetup.ios.min,
          o.projectSetup.max += t.projectSetup.android.max + t.projectSetup.ios.max,
          o.architecture.min += t.architecture.android.min + t.architecture.ios.min,
          o.architecture.max += t.architecture.android.max + t.architecture.ios.max,
          i.min = e.android.min + e.ios.min,
          i.max = e.android.max + e.ios.max;
          a = 3
      }
    o.database = { min: (e.web.min + i.min)*0.1, max: (e.web.max + i.max)*0.1 };
    o.network = { min: i.min*0.09, max: i.max*0.09 };
    o.swagger = { min: e.web.min*0.1, max: e.web.max*0.1 };
    o.numberOfSprints = Math.max((e.web.min+e.web.max)/2, (e.android.min+e.android.max)/2, (e.ios.min+e.ios.max)/2) / 70;
    o.meetingsTime = { min: a * o.numberOfSprints * 2.5, max: a * o.numberOfSprints * 5 };
    o.releasePerSprint = { min: 2 * o.numberOfSprints, max: 3 * o.numberOfSprints };
    o.releaseToProduction = { min: 4 * a, max: 5 * a };
    o.meetingsAmount = { min: 6 * o.numberOfSprints, max: 10 * o.numberOfSprints }
    
    return { i, e, o };
  }

  setDesignHours() {
    if (this.featuresSelected.length > 0) {
      const hours = this.featuresSelected.reduce((total, fs) => {
        const subTotal = fs.features.reduce((sfsTotal, sfs) => {
          if (sfs.isSelected) {
            sfsTotal += sfs.designMin + sfs.designMax;
          }
          return sfsTotal;
        }, 0);
        if (subTotal) {
          total += subTotal;
        }
        return total;
      }, 0);
      if (hours) {
        this.designHours = +((hours/2).toFixed(1));
      }
    } else {
      this.designHours = 0;
    }
  }

  addContactToMailChimp(email: string) {
    return this.http.post('https://us10.api.mailchimp.com/3.0/lists/51f9a49ccb/members',
    {"email_address":email,"status":"subscribed"},
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'origin': 'https://mailchimp.com/',
        'Authorization':'Basic' +  btoa('key:fd5189a936f75e0abe75d06e31460011-us10')
      })
    });
  }

  resetCalc() {
    this.currentStep = 1;
    this.platformSelected = '';
    this.featuresSelected = [];
    this.selectedTileDetail = [];
    this.currentStepDetail = {};
    this.designSelected = '';
    this.devHours = 0;
    this.nonDevHours = 0;
    this.designHours = 0;
    this.currentStepHours = 0;
  }
}
