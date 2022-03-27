import '@testing-library/jest-dom'
import { render, fireEvent, waitFor } from "@testing-library/svelte";
import TestComponent from './TestComponent.svelte';
import MultiplePortalComponent from './MultiplePortalComponent.svelte';

describe("<ElementPortal target />", () => {
    describe('TestComponent.svelte', () => {
        it("should render default slot", () => {
            const { getByTestId } = render(TestComponent)
    
            const element = getByTestId("mainElement");
            expect(element).toBeInTheDocument()
        });
    
        it("should not render item slot", () => {
            const { queryByTestId } = render(TestComponent)
    
            const element = queryByTestId("portalElement");
            expect(element).not.toBeInTheDocument()
        });
    
        it("should render item slot on hover - pointerenter", async () => {
            const {container, getByTestId, findByTestId } = render(TestComponent)
    
            const element = getByTestId("mainElement");
    
            await fireEvent.pointerEnter(element.parentElement)
            // wait for appearance to confirm the portal-item was rendered
            const portalItem = await findByTestId('portalElement')
            expect(portalItem).toBeInTheDocument()
    
            // confirm that the portal-item is rendered in the correct position, inside target.
            const renderPortalElement = container.querySelector(
                "#target [data-testid='portalElement']"
            );
            expect(renderPortalElement).toBeInTheDocument()
        });
    
        it("should remove item slot on pointerleave", async () => {
            const {container, getByTestId, queryByTestId } = render(TestComponent)
    
            const element = getByTestId("mainElement");
    
            await fireEvent.pointerEnter(element.parentElement)
    
            await waitFor(() => {
                const renderPortalElement = container.querySelector(
                    "#target [data-testid='portalElement']"
                );
                expect(renderPortalElement).toBeInTheDocument()
            })
    
            await fireEvent.pointerLeave(element.parentElement)
             // confirm the portal-item was removed on pointerleave
             const portalItem = queryByTestId('portalElement')
             expect(portalItem).not.toBeInTheDocument()
        });
    })

    describe('MultiplePortalComponent.svelte', () => {
        it("should render the default slots of all <PortalElement />", () => {
            const { getAllByTestId } = render(MultiplePortalComponent)

            const elements = getAllByTestId(/mainElement\d/);
            expect(elements).toHaveLength(4)
            
            elements.forEach((element) => expect(element).toBeInTheDocument())
        });
        it("should not render item slot of any <PortalElement />", () => {
            const { queryAllByTestId } = render(MultiplePortalComponent)
    
            const elements = queryAllByTestId(/portalElement\d/);
            expect(elements).toHaveLength(0)
        });

        it("should render item slot of a hovered <PortalElement />", async () => {
            const {getByTestId, findByTestId, getAllByTestId } = render(MultiplePortalComponent)
    
            const hoverElement = getByTestId("mainElement1");
    
            await fireEvent.pointerEnter(hoverElement.parentElement)

            // confirm the portal-item was rendered
            const portalItem = await findByTestId('portalElement1')
            expect(portalItem).toBeInTheDocument()
    
            // confirm the portal-item is the only rendered item slot
            const elements = getAllByTestId(/portalElement\d/);
            expect(elements).toHaveLength(1)
            expect(elements[0]).toBe(portalItem)
        });

        it("should render only one portal-item in target", async () => {
            //! mainElement4 uses PortalElement with same target as mainElement1
            const {getByTestId, queryByTestId, findByTestId } = render(MultiplePortalComponent)
    
            // hover mainElement1 first
            const element1 = getByTestId("mainElement1");
            await fireEvent.pointerEnter(element1.parentElement)
    
            await waitFor(() => {
                const portalItem1 = queryByTestId('portalElement1')
                expect(portalItem1).toBeInTheDocument()

                const portalItem4 = queryByTestId('portalElement4')
                expect(portalItem4).not.toBeInTheDocument()
            })

            const element4 = getByTestId("mainElement4");
            await fireEvent.pointerEnter(element4.parentElement)

            await waitFor(() => {
                const portalItem1 = queryByTestId('portalElement1')
                expect(portalItem1).not.toBeInTheDocument()
    
                const portalItem4 = queryByTestId('portalElement4')
                expect(portalItem4).toBeInTheDocument()
            })
        });
    })
})