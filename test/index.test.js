import { render, fireEvent, waitFor } from "@testing-library/svelte";
import TestComponent from './TestComponent.svelte';
import MultiplePortalComponent from './MultiplePortalComponent.svelte';
import WrongTargetComponent from './WrongTargetComponent.svelte';

describe("<ElementPortal target />", () => {
    describe('TestComponent.svelte', () => {
        it("should render default slot", () => {
            const { getByTestId } = render(TestComponent)
    
            const element = getByTestId("mainElement");
            expect(element).toBeInTheDocument()
        });
    
        it("should not render item slot", () => {
            const { queryByTestId } = render(TestComponent)
    
            const element = queryByTestId("portalItem");
            expect(element).not.toBeInTheDocument()
        });
    
        it("should render item slot on hover - pointerenter", async () => {
            const {container, getByTestId, findByTestId } = render(TestComponent)
    
            const element = getByTestId("mainElement");
    
            await fireEvent.pointerEnter(element)
            // wait for appearance to confirm the portal-item was rendered
            const portalItem = await findByTestId('portalItem')
            expect(portalItem).toBeInTheDocument()
    
            // confirm that the portal-item is rendered in the correct position, inside target.
            const renderPortalItem = container.querySelector(
                "#target [data-testid='portalItem']"
            );
            expect(renderPortalItem).toBeInTheDocument()
        });
    
        it("should remove item slot on pointerleave", async () => {
            const {container, getByTestId, queryByTestId } = render(TestComponent)
    
            const element = getByTestId("mainElement");
    
            await fireEvent.pointerEnter(element)
    
            await waitFor(() => {
                const renderPortalItem = container.querySelector(
                    "#target [data-testid='portalItem']"
                );
                expect(renderPortalItem).toBeInTheDocument()
            })
    
            await fireEvent.pointerLeave(element)
             // confirm the portal-item was removed on pointerleave
             const portalItem = queryByTestId('portalItem')
             expect(portalItem).not.toBeInTheDocument()
        });
    })

    describe('MultiplePortalComponent.svelte', () => {
        it("should render the default slots of all <portalItem />", () => {
            const { getAllByTestId } = render(MultiplePortalComponent)

            const elements = getAllByTestId(/mainElement\d/);
            expect(elements).toHaveLength(4)
            
            elements.forEach((element) => expect(element).toBeInTheDocument())
        });
        it("should not render item slot of any <ElementPortal />", () => {
            const { queryAllByTestId } = render(MultiplePortalComponent)
    
            const elements = queryAllByTestId(/portalItem\d/);
            expect(elements).toHaveLength(0)
        });

        it("should render item slot of a hovered <ElementPortal />", async () => {
            const {getByTestId, findByTestId, getAllByTestId } = render(MultiplePortalComponent)
    
            const hoverElement = getByTestId("mainElement1");
    
            await fireEvent.pointerEnter(hoverElement)

            // confirm the portal-item was rendered
            const portalItem = await findByTestId('portalItem1')
            expect(portalItem).toBeInTheDocument()
    
            // confirm the portal-item is the only rendered item slot
            const elements = getAllByTestId(/portalItem\d/);
            expect(elements).toHaveLength(1)
            expect(elements[0]).toBe(portalItem)
        });

        it("should render only one portal-item in target", async () => {
            //! mainElement4 uses portalItem with same target as mainElement1
            const {getByTestId, queryByTestId } = render(MultiplePortalComponent)
    
            // hover mainElement1 first
            const element1 = getByTestId("mainElement1");
            await fireEvent.pointerEnter(element1)
    
            await waitFor(() => {
                const portalItem1 = queryByTestId('portalItem1')
                expect(portalItem1).toBeInTheDocument()

                const portalItem4 = queryByTestId('portalItem4')
                expect(portalItem4).not.toBeInTheDocument()
            })

            const element4 = getByTestId("mainElement4");
            await fireEvent.pointerEnter(element4)

            await waitFor(() => {
                const portalItem1 = queryByTestId('portalItem1')
                expect(portalItem1).not.toBeInTheDocument()
    
                const portalItem4 = queryByTestId('portalItem4')
                expect(portalItem4).toBeInTheDocument()
            })
        });
    })

    describe('WrongTargetComponent.svelte', () => {
        it('should throw error when target is wrong or does not exist', () => {
            try {
                render(WrongTargetComponent)
            } catch (error) {
                expect(error instanceof TypeError).toBeTruthy()
            }
        })
    })
})