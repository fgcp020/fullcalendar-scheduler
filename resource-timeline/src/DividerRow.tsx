import { createElement, Ref, BaseComponent, CssDimValue, RenderHook } from '@fullcalendar/common'
import { GroupLaneRenderHooks, ColCellHookProps } from '@fullcalendar/resource-common'


export interface DividerRowProps {
  elRef?: Ref<HTMLTableRowElement>
  innerHeight: CssDimValue
  groupValue: any
  renderingHooks: GroupLaneRenderHooks
}


/*
parallels the SpreadsheetGroupRow
*/
export class DividerRow extends BaseComponent<DividerRowProps> {

  render() {
    let { props } = this
    let { renderingHooks } = this.props
    let hookProps: ColCellHookProps = { groupValue: props.groupValue, view: this.context.viewApi }

    return (
      <tr ref={props.elRef}>
        <RenderHook
          hookProps={hookProps}
          classNames={renderingHooks.laneClassNames}
          content={renderingHooks.laneContent}
          didMount={renderingHooks.laneDidMount}
          willUnmount={renderingHooks.laneWillUnmount}
        >
          {(rootElRef, classNames, innerElRef, innerContent) => (
            <td className={[ 'fc-timeline-lane', 'fc-resource-group', this.context.theme.getClass('tableCellShaded')].concat(classNames).join(' ')} ref={rootElRef}>
              <div style={{ height: props.innerHeight }} ref={innerElRef}>
                {innerContent}
              </div>
            </td>
          )}
        </RenderHook>
      </tr>
    )
  }

}
