import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf'
import 'jspdf-autotable'

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  constructor(private mainService: MainService, private route: ActivatedRoute) { }

  ngOnInit() {
    const uuid = this.route.snapshot.paramMap.get('uid');
    if (uuid) {
      this.mainService.getServerEstimates(uuid)
      .subscribe(
        ({ uid, estimate }) => {
          if (estimate) {
            const { appName, designSelected, e, o, featuresSelected } = JSON.parse(estimate);
            this.downloadPDF(uid, appName, designSelected, e, o, featuresSelected);
          }
        },
        err => console.log(err)
      )
    }
  }

  downloadPDF(name: string, appName, designSelected, e, o, featuresSelected) {
    const doc: any = new jsPDF()
    let body = [];
    const iosRow = ['iOS Development', e.ios.min > 0 ? ((e.ios.min + e.ios.max)/2).toFixed(1) : 0, (e.ios.min).toFixed(1), (e.ios.max).toFixed(1)];
    const androidRow = ['Android Development', e.android.min > 0 ? ((e.android.min + e.android.max)/2).toFixed(1) : 0, (e.android.min).toFixed(1), (e.android.max).toFixed(1)];
    const webRow = ['WEB Development(Back End)', e.web.min > 0 ? ((e.web.min + e.web.max)/2).toFixed(1) : 0, (e.web.min).toFixed(1), (e.web.max).toFixed(1)];
    const designRow = [
      'Design', 
      e.design.min > 0 ? +(((e.design.min + e.design.max)/2).toFixed(1))*(+designSelected) : 0, 
      +((e.design.min).toFixed(1))*(+designSelected), 
      +((e.design.max).toFixed(1))*(+designSelected)
    ];
    const projectSetup = ['Project Setup', o.projectSetup.min > 0 ? ((o.projectSetup.min+o.projectSetup.max)/2).toFixed(1) : 0, (o.projectSetup.min).toFixed(1), (o.projectSetup.max).toFixed(1)];
    const architecture = ['Architecture', o.architecture.min > 0 ? ((o.architecture.min+o.architecture.max)/2).toFixed(1) : 0, (o.architecture.min).toFixed(1), (o.architecture.max).toFixed(1)];
    const database = ['Database', o.database.min > 0 ? ((o.database.min+o.database.max)/2).toFixed(1) : 0, (o.database.min).toFixed(1), (o.database.max).toFixed(1)];
    const network = ['Network', o.network.min > 0 ? ((o.network.min+o.network.max)/2).toFixed(1) : 0, (o.network.min).toFixed(1), (o.network.max).toFixed(1)];
    const swagger = ['Swagger', o.swagger.min > 0 ? ((o.swagger.min+o.swagger.max)/2).toFixed(1) : 0, (o.swagger.min).toFixed(1), (o.swagger.max).toFixed(1)];
    const ci = ['Continuos Integration', o.continuousIntegration.min > 0 ? ((o.continuousIntegration.min+o.continuousIntegration.max)/2).toFixed(1) : 0, (o.continuousIntegration.min).toFixed(1), (o.continuousIntegration.max).toFixed(1)];
    const cd = ['Continuos Delivery', o.continuousDelivery.min > 0 ? ((o.continuousDelivery.min+o.continuousDelivery.max)/2).toFixed(1) : 0, (o.continuousDelivery.min).toFixed(1), (o.continuousDelivery.max).toFixed(1)];
    const meetings = ['Meetings', o.meetingsTime.min > 0 ? ((o.meetingsTime.min+o.meetingsTime.max)/2).toFixed(1) : 0, (o.meetingsTime.min).toFixed(1), (o.meetingsTime.max).toFixed(1)];
    const releasePerSprint = ['Release per Sprint', o.releasePerSprint.min > 0 ? ((o.releasePerSprint.min+o.releasePerSprint.max)/2).toFixed(1) : 0, (o.releasePerSprint.min).toFixed(1), (o.releasePerSprint.max).toFixed(1)];
    const releaseToProd = ['Release to Production', o.releaseToProduction.min > 0 ? ((o.releaseToProduction.min+o.releaseToProduction.max)/2).toFixed(1) : 0, (o.releaseToProduction.min).toFixed(1), (o.releaseToProduction.max).toFixed(1)];
    
    for (let data of [iosRow, androidRow, webRow, designRow]) {
      if (data[1] > 0) {
        body.push(data);
      }
    }
    const date = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',	'November', 'December'];
    const summary_date = date.getDate() + ' ' + months[date.getMonth()] + ', ' + date.getFullYear();
    if (body.length > 0) {
      doc.autoTable({
        body: [[{ content: '', colSpan: 4, styles: { valign: 'middle', halign: 'center', fillColor: 'ffffff' } }]],
        didDrawCell: (data) => {
          if (data.section === 'body' && data.column.index === 0) {
            var base64Img = 'data:image/png;base64,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'
            doc.addImage(base64Img, 'PNG', data.cell.x + 2, 12, 75, 16)
          }
        },
      });
      doc.autoTable({
        head: [[{ content: `Rough Estimate ${appName} Users app Summary`, colSpan: 4, styles: { valign: 'middle', fontSize: 22, fillColor: 'ffffff', textColor: 'black' } }]],
        body: [[{ content: summary_date, colSpan: 4, styles: { valign: 'middle', fontSize: 10, fillColor: 'ffffff' } }]]
      })   
      doc.autoTable({
        head: [[
          { content: 'Section', rowSpan: 2,styles: { valign: 'middle', fontSize: 18 }},
          { content: 'Time, hours', rowSpan: 2,styles: { valign: 'middle', halign: 'center' }},
          { content: 'Optimistic, hours', rowSpan: 2,styles: { valign: 'middle', halign: 'center' }},
          { content: 'Pessimistic, hours', rowSpan: 2,styles: { valign: 'middle', halign: 'center' }}, 
          ]],
        body: [
          ['','','',''],
          [{ content: 'Development Time', colSpan: 4, styles: { valign: 'middle', halign: 'center', fontSize: 18, textColor: 'black', fillColor: 'eeeeee' } }],
          ...body,
          [{ content: 'Non Development Time', colSpan: 4, styles: { valign: 'middle', halign: 'center', fontSize: 18, textColor: 'black', fillColor: 'eeeeee' }}],
          projectSetup, architecture, database, network, swagger, meetings, ci, cd, releasePerSprint, releaseToProd
        ],
        foot: [this.calculateTotal(e, o, designSelected)],
        showHead: 'firstPage',
        showFoot: 'lastPage',
        theme: 'plain',
        tableLineColor: 'cccccc',
        lineColor: 'eeeeee',
        lineWidth: 1,
        tableLineWidth: 0.5,
        columnStyles: {0: { textColor: [109 ,151, 251] },1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'center' }},
        styles: { cellPadding: {top: 3, right: 5, bottom: 3, left: 5}, fontSize: 12 }
      })
      const keysNames = {android: 'ANDROID', ios: 'iOS', web: 'WEB (BACK END)', design: 'DESIGN'};
      for (const key of ['android', 'ios', 'web', 'design']) {
        if (e[key].min > 0 && e[key].max > 0) {
          if (key == 'design' && designSelected == '0') {
            console.log('Skip Head')
          } else {
            doc.autoTable({
              head: [[{ content: `${keysNames[key]}. DEVELOPMENT TIME`, colSpan: 4, styles: { valign: 'middle', fontSize: 20, fillColor: 'ffffff', textColor: 'black' } }]],
              body: [
                ['Features', 'Time, hours', 'Optimistic, hours', 'Pessimistic, hours'],
                ...this.getPdfDataForFeatures(key, designSelected, featuresSelected)
              ],
              showHead: 'firstPage',
              showFoot: 'lastPage',
              theme: 'plain',
              tableLineColor: 'cccccc',
              tableLineWidth: 0.5,
              columnStyles: {1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'center' }},
              pageBreak: 'avoid',
              styles: { cellPadding: 5, fontSize: 14 },
              lineColor: 'eeeeee',
              lineWidth: 1,
            });
          }
        }
      }
      if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()))
      {
        window.open(doc.output('bloburl', { filename: name + '.pdf' }))
      }
      else
      {
        doc.save(name + '.pdf');
      }
    }
  }

  getPdfDataForFeatures(key: string, designSelected, featuresSelected): Array<any> {
    const devTimeArr = [];
    const allSelected = featuresSelected;
    for (const selected of allSelected) {
      if (selected.features.filter(f => f.isSelected && (f[`${key}Min`] > 0 && f[`${key}Max`] > 0)).length > 0) {
        if (key === 'design' && designSelected == '0') {
          console.log('Skip')
        } else {
          devTimeArr.push([{ content: selected.title, colSpan: 4, styles: { valign: 'middle', fontSize: 18, fillColor: 'eeeeee' } }]);
          for (const feature of selected.features) {
            if (!(feature[`${key}Min`] === 0 && feature[`${key}Max`] === 0) && feature.isSelected) {
              const total = ((feature[`${key}Min`]+feature[`${key}Max`])/2).toFixed(1);
              const min = feature[`${key}Min`];
              const max = feature[`${key}Max`];
              devTimeArr.push([
                feature.title, 
                key == 'design' ? +total*(+designSelected) : total, 
                key == 'design' ? +min*(+designSelected) : min, 
                key == 'design' ? +max*(+designSelected) : max
              ]);
            }
          }
        }
      }
    }
    return devTimeArr;
  }

  calculateTotal (e, o, designSelected): Array<string | object> {
    let total = e.web.min + e.web.max + e.android.min + e.android.max + e.ios.min + e.ios.max + ((e.design.min + e.design.max)*(+designSelected));
    let optimistic = e.web.min + e.android.min + e.ios.min + e.design.min;
    let pessimistic = e.web.max + e.android.max+ e.ios.max + e.design.max;
    Object.keys(o).forEach((key: any) => {
      if (key != 'numberOfSprints' && key !== 'meetingsAmount') {
        total += o[key].min + o[key].max;
        optimistic += o[key].min;
        pessimistic += o[key].max;
      }
    })
    return [
      { content: 'TOTAL', styles: { textColor: 'ffffff', fillColor: [109 ,151, 251] } }, 
      { content: (total/2).toFixed(1), styles: { halign: 'center', textColor: 'ffffff', fillColor: [109 ,151, 251] } },
      { content: (optimistic).toFixed(1), styles: { halign: 'center', textColor: 'ffffff', fillColor: [109 ,151, 251] } }, 
      { content: (pessimistic).toFixed(1), styles: { halign: 'center', textColor: 'ffffff', fillColor: [109 ,151, 251] } }
    ];
  }

}
