import '@testing-library/jest-dom'
import { render, fireEvent, waitFor } from "@testing-library/svelte";
import TestComponent from './TestComponent.svelte';

describe("<ElementPortal target />", () => {
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
        const renderedDivInFooter = container.querySelector(
            "#target [data-testid='portalElement']"
        );
        expect(renderedDivInFooter).toBeInTheDocument()
    });

    it("should remove item slot on pointerleave", async () => {
        const {container, getByTestId, queryByTestId } = render(TestComponent)

        const element = getByTestId("mainElement");

        await fireEvent.pointerEnter(element.parentElement)

        await waitFor(() => {
            const renderedDivInFooter = container.querySelector(
                "#target [data-testid='portalElement']"
            );
            expect(renderedDivInFooter).toBeInTheDocument()
        })

        await fireEvent.pointerLeave(element.parentElement)
         // confirm the portal-item was removed on pointerleave
         const portalItem = queryByTestId('portalElement')
         expect(portalItem).not.toBeInTheDocument()
    });
})