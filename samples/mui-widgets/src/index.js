import {muiSwitchWidgetDef} from './MUISwitchComponent';
import {muiRatingWidgetDef} from './MUIRatingComponent';
import './index.css';

if (typeof nitro !== 'undefined') {
  // eslint-disable-next-line no-undef
  nitro.registerWidget(muiSwitchWidgetDef);
  // eslint-disable-next-line no-undef
  nitro.registerWidget(muiRatingWidgetDef);
}
