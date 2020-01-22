import JsPdf from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

import bikeLog from '../assets/Logo-1.png';
import ankleAngle from '../assets/img/ankle_angle.png';
import ankleAngleBottom from '../assets/img/ankle_angle_bottom.png';
import ankleAngleRear from '../assets/img/ankle_angle_rear.png';
import ankleAngleAtTop from '../assets/img/ankle_angle_top.png';
import ankleAngleAtFront from '../assets/img/ankle_angle_front.png';
import kneeAngle from '../assets/img/knee_angle.png';
import hipAngle from '../assets/img/hip_angle.png';
import backFromLevel from '../assets/img/back_from_level.png';
import shoulderAnkleWrist from '../assets/img/hip_shoulder_wrist.png';
import elbowAngle from '../assets/img/hip_shoulder_elbow.png';
import forearmAngle from '../assets/img/forearm_from_level.png';
import kneeFootForward from '../assets/img/knee_to_foot_forward.png';
import kneeFootLateral from '../assets/img/knee_to_feet_lateral.png';
import hipFootLateral from '../assets/img/hip_to_foot_lateral.png';
import shoulderWristLateral from '../assets/img/shoulder_to_wrist_lateral.png';
import footFromLevel from '../assets/img/foot_from_level.png';
import kneeLateralTravel from '../assets/img/knee_lateral_travel.png';
import hipVerticalTravel from '../assets/img/hip_vertical_travel.png';
import hipLateralTravel from '../assets/img/hip_lateral_travel.png';
import markerPath from '../assets/img/marker_path.png';

import appendix1 from '../assets/img/appendix1.png';
import appendix2 from '../assets/img/appendix2.png';
import appendix3 from '../assets/img/appendix3.png';



const generateReport = (riderInfo, fittingData) => {
  const { angles, distance, images, skeleton } = fittingData;
  const doc = new JsPdf({
    orientation: 'p',
    unit: 'px',
    format: 'a4',
  });

  const SIDE_MARGIN = 10;
  const CONTENT_WIDTH = doc.internal.pageSize.width - 2 * SIDE_MARGIN;
  const HALF_MARGIN = 10;
  const HALF_CONTENT_WIDTH = (CONTENT_WIDTH - HALF_MARGIN) / 2;
  const HALF_HEADER_BEGIN = SIDE_MARGIN + HALF_CONTENT_WIDTH + HALF_MARGIN;
  const HEADER_HEIGHT = 16;
  const LINE_MARGIN = 12;

  const getFittingValue = (object, key, secondKey) => {
    if (object[key] && object[key][secondKey]) {
      return object[key][secondKey];
    }
    return '--';
  };

  const getRowValue = (object, key) => {
    const rowValue = [];
    rowValue.push(getFittingValue(object, key, 'left_less_than_range'));
    rowValue.push(getFittingValue(object, key, 'left'));
    rowValue.push(getFittingValue(object, key, 'left_more_than_range'));
    rowValue.push(getFittingValue(object, key, 'right_less_than_range'));
    rowValue.push(getFittingValue(object, key, 'right'));
    rowValue.push(getFittingValue(object, key, 'right_more_than_range'));

    const range = getFittingValue(object, key, 'good_range');
    let rangeStr;
    if (range[0] === null) {
      rangeStr = '--'
    } else {
      rangeStr = `${range[0]}-${range[1]}`
    }
    rowValue.push(rangeStr);
    return rowValue;
  };

  const tableFittingData = {
    fitAngles1: [
      [{ img: ankleAngle, rowSpan: 3 }, 'Ankle Angle Min', ...getRowValue(angles, 'Ankle_Angle_Min')],
      [ 'Ankle Angle Max', ...getRowValue(angles, 'Ankle_Angle_MAx') ],
      [ 'Ankle Angle Range', ...getRowValue(angles, 'Ankle_Angle_Range') ],
      [ { img: ankleAngleBottom, rowSpan: 3 } ],
      [ 'Ankle Angle at Bottom', ...getRowValue(angles, 'Ankle_Angle_Bottom')],
      [],
      [ { img: ankleAngleRear, rowSpan: 3 } ],
      [ 'Ankle Angle at Rear', ...getRowValue(angles, 'Ankle_Angle_Rear') ],
      [],
      [ { img: ankleAngleAtTop, rowSpan: 3 } ],
      [ 'Ankle Angle at Top', ...getRowValue(angles, 'Ankle_Angle_Top') ],
      [],
      [ { img: ankleAngleAtFront, rowSpan: 3} ],
      [ 'Ankle Angle at Front', ...getRowValue(angles, 'Ankle_Angle_Forward') ],
      [],
      [ { img: kneeAngle, rowSpan: 3 }, 'Knee Angle Flexion', ...getRowValue(angles, 'Knee_Angle_Max') ],
      [ 'Knee Angle Extension', ...getRowValue(angles, 'Knee_Angle_Min') ],
      [ 'Knee Angle Range', ...getRowValue(angles, 'Knee_Angle_Range') ],
      [ { img: hipAngle, rowSpan: 3 }, 'Hip Angle Closed', ...getRowValue(angles, 'Hip_Angle_Min') ],
      [ 'Hip Angle Open', ...getRowValue(angles, 'Hip_Angle_Max') ],
      [ 'Hip Angle Range', ...getRowValue(angles, 'Hip_Angle_Range') ],
      [ { img: backFromLevel, rowSpan: 3 }, 'Back From Level', ...getRowValue(angles, 'Back_From_Level') ],
      [ 'Mean', ...getRowValue(angles, 'Back_From_Level_Average') ],
      [],
      [ { img: shoulderAnkleWrist, rowSpan: 3 }, 'Shoulder Angle Wrist', ...getRowValue(angles, 'Hip_Shoulder_Wrist') ],
      [ 'Mean', ...getRowValue(angles, 'Hip_Shoulder_Wrist_Average')],
      []
    ],
    fitAngles2: [
      [ { img: elbowAngle, rowSpan: 3 }, 'Elbow Angle', ...getRowValue(angles, 'Elbow_Angle') ],
      [ 'Mean', ...getRowValue(angles, 'Elbow_Angle_Average')], [],
      [ {img: forearmAngle, rowSpan: 3 }, 'Forearm Angle', ...getRowValue(angles, 'Forearm_From_Level') ],
      [ 'Mean', ...getRowValue(angles,'Forearm_From_Level_Average') ], []
    ],
    fitAlignment: [
      [ { img: kneeFootForward, rowSpan: 3 } ],
      [ 'Knee Forward of Foot', ...getRowValue(distance, 'Knee_to_Foot_Forward') ],
      [],
      [ { img: kneeFootLateral, rowSpan: 3} ],
      [ 'Knee to Foot Lateral', ...getRowValue(distance, 'Knee_to_Foot_Lateral')],
      [],
      [ { img: hipFootLateral, rowSpan: 3} ],
      [ 'Hip Vertical Lateral', ...getRowValue(distance, 'Hip_to_Foot_Lateral')],
      [],
      [ { img: shoulderWristLateral, rowSpan: 3 } ],
      [ 'Shoulder to Wrist Lateral', ...getRowValue(distance, 'Shoulder_to_Wrist_Lateral')],
      []
    ],
    fitMovement: [
      [ { img: footFromLevel, rowSpan: 3 }, 'Foot From Level', ...getRowValue(angles, 'Foot_From_Level') ],
      [ 'Mean', ...getRowValue(angles, 'Foot_From_Level_Average') ],
      [],
      [ { img: kneeLateralTravel, rowSpan: 3} ],
      [ 'Knee Lateral Travel', ...getRowValue(distance, 'Knee_Lateral_Travel') ],
      [],
      [ { img: hipVerticalTravel, rowSpan: 3} ],
      [ 'Hip Vertical Travel', ...getRowValue(distance, 'Hip_Vertical_Travel') ],
      [],
      [ { img: hipLateralTravel, rowSpan: 3} ],
      [ 'Hip Lateral Travel', ...getRowValue(distance, 'Hip_Lateral_Travel')],
      [],
    ],
    markerPath: [
      [ { img: markerPath} , 'Front View of Knee Path', { img: images.img_knee_path, isKneePath: true } ]
    ]
  };


  const getMirrorX = (width, x) => {
    return width - x;
  };

  const centeredText = (text, y) => {
    const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const textOffset = (doc.internal.pageSize.width - textWidth) / 2;
    doc.text(textOffset, y, text);
  };

  const centerImage = (src, width, height, y) => {
    const imageOffset = (doc.internal.pageSize.width - width) / 2;

    const image = new Image();
    image.src = src;
    image.onload = () => {
      doc.addImage(image, imageOffset, y, width, height);
    };
  };

  const renderImage = (src, callback) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      callback(image);
    };
  };

  const renderTextCell = (title, textInfo, x, y, width) => {
    renderHeader(title, x, y, width);
    doc.setFontSize(12);
    doc.setTextColor('#000');
    doc.setFontType('normal');
    let infoLine = y + HEADER_HEIGHT + LINE_MARGIN;
    let keyWidth;
    textInfo.forEach((textObj) => {
      if (textObj.key) {
        const key = textObj.key;
        keyWidth = doc.getStringUnitWidth(key) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        doc.setFontType('bold');
        doc.text(key, x + 5, infoLine);
        doc.setFontType('normal');
      } else {
        keyWidth = 0;
      }
      const splitText = doc.splitTextToSize(textObj.value, width - keyWidth - 10);
      splitText.forEach((text) => {
        doc.text(text, x + keyWidth + 5, infoLine);
        infoLine += LINE_MARGIN;
      });
    });
  };


  const renderHeader = (name, x, y, width) => {
    doc.setFillColor('#b9dbff');
    doc.setDrawColor(0);
    doc.setTextColor('#000');
    doc.setFontSize(14);
    doc.setFontType("bold");
    doc.rect(x, y, width, HEADER_HEIGHT, 'F');

    doc.text(name, x + 5, y + 12);
  };

  const processPage1 = () => {
    return new Promise((resolve, reject) => {
      // header
      doc.setFontSize(12);
      doc.setTextColor(130, 130, 130);
      doc.text('Personal Bike Fitting Report', SIDE_MARGIN, 20);

      doc.setDrawColor(102, 177, 255);
      doc.setLineWidth(1);
      doc.line(SIDE_MARGIN, 30, getMirrorX(doc.internal.pageSize.width, SIDE_MARGIN), 30);

      //userName
      doc.setFontSize(18);
      doc.setTextColor(102, 177, 255);
      centeredText(riderInfo.user.name, 50);
      // time
      doc.setFontSize(14);
      doc.setTextColor(156, 65, 87);
      centeredText(moment()
        .format('YYYY-MM-DD hh:mm a'), 70);

      // rider info
      const riderPdf = [
        { value: riderInfo.user.name },
        { value: riderInfo.user.gender === 1 ? 'Male' : 'Female' },
        { value: `Age: ${riderInfo.user.age}` },
        { value: riderInfo.user.phone },
        { value: riderInfo.user.email },
      ];
      renderTextCell('RIDER', riderPdf, SIDE_MARGIN, 200, HALF_CONTENT_WIDTH);

      // bikeInfo
      const bikePdf = [{
        key: 'MODEL: ',
        value: riderInfo.bike.model,
      }, {
        key: 'SIZE: ',
        value: riderInfo.bike.size,
      }, {
        key: 'YEAR: ',
        value: String(riderInfo.bike.year),
      }, {
        key: 'TYPE: ',
        value: riderInfo.bike.type,
      }];
      renderTextCell('BIKE', bikePdf, HALF_HEADER_BEGIN, 200, HALF_CONTENT_WIDTH);

      // logo
      const imageOffset = (doc.internal.pageSize.width - 292) / 2;

      const image = new Image();
      image.onload = () => {
        doc.addImage(image, imageOffset, 90, 292, 96);
        resolve();
      };
      image.src = bikeLog;
    });
  };

  const renderTitle = (text, subText) => {
    doc.setFontType('bold');
    doc.setTextColor('#66B1FF');
    doc.setFontSize(22);
    centeredText(text, 30);

    if (subText) {
      doc.setFontType('normal');
      doc.setTextColor('#a7a7a7');
      doc.setFontSize(16);
      centeredText(subText, 46);
    }
  };

  const renderTableData = (tableData, startY, resolve) => {
    const itemCount = tableData.length / 3;
    let renderedImage = 0;
    doc.autoTable({
      startY: startY,
      margin: SIDE_MARGIN,
      tableWidth: CONTENT_WIDTH,
      head: [[{
        content: '',
        rowSpan: 2,
        styles: { cellWidth: 60 },
      }, {
        content: 'Title',
        rowSpan: 2,
        styles: { cellWidth: 80 },
      }, {
        content: 'Left',
        colSpan: 3,
      }, {
        content: 'Right',
        colSpan: 3,
      }, {
        content: 'Range',
        rowSpan: 2,
      }], [{
        content: 'Max Less',
      }, {
        content: 'Now',
      }, {
        content: 'Max More',
      }, {
        content: 'Max Less',
      }, {
        content: 'Now',
      }, {
        content: 'Max More',
      }]],
      body: tableData,
      headStyles: {
        fillColor: '#66B1FF',
        halign: 'center',
        valign: 'middle'
      },
      columnStyles: {},
      didParseCell: (data) => {
        if (data.row.section === 'body') {
          if (data.cell.raw && data.cell.raw.img) {
            // replace with image
            data.cell.text = '';
          }
        }
      },
      didDrawCell: (data) => {
        if (data.row.section === 'body' && data.cell.raw && data.cell.raw.img) {
          const image = new Image();
          image.onload = () => {
            doc.addImage(image, 'PNG', data.cell.x + 2, data.cell.y + 5, 56, 39);
            if (resolve && (++renderedImage >= itemCount)) {
              resolve();
            }
          };
          image.src = data.cell.raw.img;
        }
      },
    });
  };

  const processPage2 = () => {
    return new Promise((resolve) => {
      doc.addPage();
      // title
      renderTitle('FIT REPORT: FINAL ANGLES', riderInfo.bike.model);
      renderHeader('FIT ANGLES', SIDE_MARGIN, 80, CONTENT_WIDTH);

      renderTableData(tableFittingData.fitAngles1, 110, resolve);
    });
  };

  const processPage3 = () => {
    const renderFitAngles2 = () => {
      return new Promise((resolve) => {
        doc.addPage();
        renderHeader('FIT ALIGNMENT', SIDE_MARGIN, 180, CONTENT_WIDTH);
        renderTableData(tableFittingData.fitAngles2, 30, resolve);

      });
    };

    return new Promise((resolve) => {
      renderFitAngles2().then(() => {
        renderTableData(tableFittingData.fitAlignment, 210, resolve);
      });
    });
  };

  const processPage4 = () => {
    function renderFitMovement() {
      return new Promise((resolve) => {
        doc.addPage();
        renderHeader('FIT MOVEMENT', SIDE_MARGIN, 30, CONTENT_WIDTH);
        renderTableData(tableFittingData.fitMovement, 60, resolve);
      });
    }

    function renderMarkNote() {
      doc.setFontSize(10);
      doc.setTextColor('#000');
      doc.setFontType('normal');
      const markerPathNote = 'Note: Maker paths viewed from the front will be on the opposite side of the report. The paths representing the right side of the body will be shown on the left and vice versa. Green is downstroke and red is upstroke.';
      const splitText = doc.splitTextToSize(markerPathNote, CONTENT_WIDTH);
      let textLine = 350;
      splitText.forEach((text) => {
        doc.text(text, SIDE_MARGIN, textLine);
        textLine += LINE_MARGIN;
      });
    }

    function renderKneePath(resolve) {
      const KNEE_PATH_IMG = 2;
      let renderedImg = 0;
      doc.autoTable({
        startY: 380,
        margin: SIDE_MARGIN,
        tableWidth: CONTENT_WIDTH,
        head: [
          [{
            content: '',
            styles: { cellWidth: 60 },
          }, {
            content: 'Title',
            styles: { cellWidth: 90 },
          }, {
            content: 'Front View of Knee Path',
          }]
        ],
        headStyles: {
          fillColor: '#66B1FF',
          halign: 'center',
          valign: 'middle'
        },
        body: tableFittingData.markerPath,
        columnStyles: {},
        didParseCell: (data) => {
          if (data.row.section === 'body') {
            if (data.cell.raw) {
              if (data.cell.raw.img) {
                // replace with image
                data.cell.text = '';
              }
              data.cell.styles.minCellHeight = 200;
            }
          }
        },
        willDrawCell: (data) => {
          if (data.row.section === 'body' && data.cell.raw) {
            data.cell.textPos.y += 80;
          }
        },
        didDrawCell: (data) => {
          let yPadding;
          let imgWidth;
          let imgHeight;
          if (data.cell.raw && data.cell.raw.img) {
            if (data.row.section === 'body' && data.cell.raw.isKneePath) {
              yPadding = 20;
              imgWidth = 90;
              imgHeight = 160;
              data.cell.raw.img = `data:image/jpeg;base64,${data.cell.raw.img}`;
            } else {
              yPadding = 80;
              imgWidth = 56;
              imgHeight = 39;
            }
            const image = new Image();
            image.onload = () => {
              doc.addImage(image, 'PNG', data.cell.x + 2, data.cell.y + yPadding, imgWidth, imgHeight);
              if (++renderedImg >= KNEE_PATH_IMG) {
                resolve();
              }
            };
            image.src = data.cell.raw.img;
          }
        },
      });
    }

    return new Promise((resolve) => {
      renderFitMovement().then(() => {
        renderHeader('MARKER PATH', SIDE_MARGIN, 320, CONTENT_WIDTH);
        renderMarkNote();
        renderKneePath(resolve);
      });
    });
  };


  const processPage5 = () => {
    const IMG_COUNT = 6;
    let renderedImg = 0;
    return new Promise(resolve => {
      doc.addPage();
      renderHeader('FINAL POSITION', SIDE_MARGIN, 20, CONTENT_WIDTH);
      renderHeader('FINAL SKELETON', SIDE_MARGIN, 300, CONTENT_WIDTH);

      const imageMargin = 10;
      const imageWidth = (CONTENT_WIDTH - 2 * imageMargin) / 3;
      const imageHeight = (16 * imageWidth) / 9;

      const leftSrc = `data:image/jpeg;base64,${images.img_left}`;
      const frontSrc = `data:image/jpeg;base64,${images.img_front}`;
      const rightSrc = `data:image/jpeg;base64,${images.img_right}`;
      renderImage(leftSrc, (image) => {
        doc.addImage(image, 'PNG', SIDE_MARGIN, 50, imageWidth, imageHeight);
        if (++renderedImg >= IMG_COUNT) {
          resolve();
        }
      });
      renderImage(rightSrc, (image) => {
        doc.addImage(image, 'PNG', SIDE_MARGIN + 2 * imageMargin + 2 * imageWidth, 50, imageWidth, imageHeight);
        if (++renderedImg >= IMG_COUNT) {
          resolve();
        }
      });
      renderImage(frontSrc, (image) => {
        doc.addImage(image, 'PNG', SIDE_MARGIN + imageMargin + imageWidth, 50, imageWidth, imageHeight);
        if (++renderedImg >= IMG_COUNT) {
          resolve();
        }
      });
      renderImage(skeleton.left, (image) => {
        doc.addImage(image, 'PNG', SIDE_MARGIN, 330, imageWidth, imageHeight);
        if (++renderedImg >= IMG_COUNT) {
          resolve();
        }
      });
      renderImage(skeleton.front, (image) => {
        doc.addImage(image, 'PNG', SIDE_MARGIN + imageMargin + imageWidth, 330, imageWidth, imageHeight);
        if (++renderedImg >= IMG_COUNT) {
          resolve();
        }
      });
      renderImage(skeleton.right, (image) => {
        doc.addImage(image, 'PNG', SIDE_MARGIN + 2 * imageMargin + 2 * imageWidth, 330, imageWidth, imageHeight);
        if (++renderedImg >= IMG_COUNT) {
          resolve();
        }
      });

    });
  };

  const processAppendix = () => {
    const addAppendix = (appendix) => {
      return new Promise(resolve => {
        doc.addPage();
        renderImage(appendix, (image) => {
          doc.addImage(image, 'PNG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);
          resolve();
        })
      });
    };
    return new Promise(resolve => {
      addAppendix(appendix1).then(() => {
        addAppendix(appendix2).then(() => {
          addAppendix(appendix3).then(() => {
            resolve();
          });
        });
      });
    });
  };

  processPage1().then(() => {
      processPage2().then(() => {
          processPage3().then(() => {
            processPage4().then(() => {
              processPage5().then(() => {
                processAppendix().then(() => {
                  doc.setProperties({
                    title: `${riderInfo.user.name}-${moment().format('YYYY-MM-DD hh:mm a')}`
                  });
                  const win = window.open();
                  win.location = URL.createObjectURL(doc.output("blob"));
                });
              });
            });
          });
        });
    });
};

export default generateReport;
