import { CalendarContext, EventApi } from '@fullcalendar/common'
import { Resource, getPublicId } from '../structs/resource'

export class ResourceApi {

  constructor(
    private _context: CalendarContext,
    public _resource: Resource
  ) {
  }

  setProp(name: string, value: any) {
    this._context.dispatch({
      type: 'SET_RESOURCE_PROP',
      resourceId: this._resource.id,
      propName: name,
      propValue: value
    })
  }

  remove() {
    this._context.dispatch({
      type: 'REMOVE_RESOURCE',
      resourceId: this._resource.id
    })
  }

  getParent(): ResourceApi | null {
    let context = this._context
    let parentId = this._resource.parentId

    if (parentId) {
      return new ResourceApi(
        context,
        context.getCurrentData().resourceSource[parentId]
      )
    } else {
      return null
    }
  }

  getChildren(): ResourceApi[] {
    let thisResourceId = this._resource.id
    let context = this._context
    let { resourceStore } = context.getCurrentData()
    let childApis: ResourceApi[] = []

    for (let resourceId in resourceStore) {
      if (resourceStore[resourceId].parentId === thisResourceId) {
        childApis.push(
          new ResourceApi(context, resourceStore[resourceId])
        )
      }
    }

    return childApis
  }

  /*
  this is really inefficient!
  TODO: make EventApi::resourceIds a hash or keep an index in the Calendar's state
  */
  getEvents(): EventApi[] {
    let thisResourceId = this._resource.id
    let context = this._context
    let { defs, instances } = context.getCurrentData().eventStore
    let eventApis: EventApi[] = []

    for (let instanceId in instances) {
      let instance = instances[instanceId]
      let def = defs[instance.defId]

      if (def.resourceIds.indexOf(thisResourceId) !== -1) { // inefficient!!!
        eventApis.push(new EventApi(context, def, instance))
      }
    }

    return eventApis
  }

  get id() { return getPublicId(this._resource.id) }
  get title() { return this._resource.title }
  get eventConstraint() { return this._resource.ui.constraints[0] || null }
  get eventOverlap() { return this._resource.ui.overlap }
  get eventAllow() { return this._resource.ui.allows[0] || null }
  get eventBackgroundColor() { return this._resource.ui.backgroundColor }
  get eventBorderColor() { return this._resource.ui.borderColor }
  get eventTextColor() { return this._resource.ui.textColor }

  // NOTE: user can't modify these because Object.freeze was called in event-def parsing
  get eventClassNames() { return this._resource.ui.classNames }
  get extendedProps() { return this._resource.extendedProps }

}
