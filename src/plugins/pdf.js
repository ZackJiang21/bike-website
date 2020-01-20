import Vue from 'vue';
import html2canvas from 'html2canvas';
import Jspdf from 'jspdf';

const PDF = {};
// eslint-disable-next-line no-unused-vars,no-shadow
PDF.install = (Vue, options) => {
  // eslint-disable-next-line no-param-reassign
  Vue.prototype.$pdf = (dom) => {
    html2canvas(dom).then((canvas) => {
      const [A4_WIDTH, A4_HEIGHT] = [595.28, 841.89];
      let position = 0;
      const CANVAS_WIDTH = canvas.width;
      let CANVAS_HEIGHT = canvas.height;
      const PAGE_WIDTH = A4_WIDTH;
      const PAGE_HEIGHT = (A4_WIDTH / CANVAS_WIDTH) * CANVAS_HEIGHT;
      const jpeg = canvas.toDataURL('image/jpeg', 1.0);
      const doc = new Jspdf('', 'pt', 'a4');
      if (CANVAS_HEIGHT < PAGE_HEIGHT) {
        doc.addImage(jpeg, 'JPEG', 0, 0, PAGE_WIDTH, PAGE_HEIGHT);
      } else {
        while (CANVAS_HEIGHT > 0) {
          doc.addImage(jpeg, 'JPEG', 0, position, PAGE_WIDTH, PAGE_HEIGHT);
          CANVAS_HEIGHT -= PAGE_HEIGHT;
          position -= A4_HEIGHT;
          if (CANVAS_HEIGHT > 0) {
            doc.addPage();
          }
        }
      }
      doc.save('test');
    });
  };
};

Vue.use(PDF);

export default PDF;
