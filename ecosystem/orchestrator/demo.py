#!/usr/bin/env python3
"""
JARVIS Brain - Live Demonstration

Shows how JARVIS Brain processes real user requests and generates
execution plans for Claude Code.

This demonstrates the complete flow:
1. User makes natural language request
2. JARVIS Brain processes it
3. Generates execution plan
4. Claude Code follows the plan
"""

from jarvis_brain import JarvisBrain


def demo_request(brain: JarvisBrain, request: str) -> None:
    """
    Demonstrate processing a single request.

    Args:
        brain: JarvisBrain instance
        request: User's natural language request
    """
    print(f"\n{'='*70}")
    print(f"💬 User: \"{request}\"")
    print('='*70)

    # Process request
    response = brain.process(request)

    # Show summary
    print(f"\n{response.summary}")

    # Show token savings
    print(f"\n💾 Token Savings: {response.token_savings_estimate}")

    # Show if confirmation needed
    if response.requires_confirmation:
        print("\n⚠️  JARVIS Brain suggests confirmation before executing")

    # Show execution plan
    print("\n📋 Execution Plan for Claude Code:")
    print("-" * 70)
    print(response.execution_plan)


def main():
    """Run demonstration of JARVIS Brain."""
    print("🧠 JARVIS Brain - Live Demonstration")
    print("=" * 70)
    print()
    print("This shows how JARVIS Brain processes natural language requests")
    print("and generates execution plans for Claude Code to follow.")
    print()

    # Initialize JARVIS Brain
    brain = JarvisBrain()

    # Demonstration scenarios
    print("\n" + "="*70)
    print("SCENARIO 1: Daily News Digest")
    print("="*70)
    print("User wants their daily AI news digest.")
    demo_request(brain, "Get today's AI news")

    print("\n" + "="*70)
    print("SCENARIO 2: Investment Research")
    print("="*70)
    print("User wants to find new investment opportunities.")
    demo_request(brain, "Find me the best ETF to buy right now")

    print("\n" + "="*70)
    print("SCENARIO 3: Multi-Step Workflow")
    print("="*70)
    print("User wants to create complete portfolio from scratch.")
    demo_request(brain, "Build my portfolio")

    print("\n" + "="*70)
    print("SCENARIO 4: Complex Multi-Domain Workflow")
    print("="*70)
    print("User wants to create video about portfolio performance.")
    demo_request(brain, "Create a video about my portfolio performance")

    # Show final statistics
    print("\n" + "="*70)
    print("📊 Session Statistics")
    print("="*70)
    stats = brain.get_statistics()
    print(f"Requests Processed: {stats['requests_processed']}")
    print(f"Total Token Savings: {stats['total_token_savings']:,} tokens")
    print(f"Estimated Cost Savings: {stats['estimated_cost_savings']}")
    print(f"Average per Request: {stats['average_savings_per_request']:,} tokens")

    print("\n" + "="*70)
    print("Key Benefits Demonstrated:")
    print("="*70)
    print("✅ Natural language understanding - no manual routing")
    print("✅ Automatic workflow detection - multi-step tasks handled")
    print("✅ Token efficiency - 83-95% reduction vs traditional approach")
    print("✅ Smart confirmation - only asks when confidence is medium")
    print("✅ Clear execution plans - Claude Code knows exactly what to do")
    print()
    print("🎯 JARVIS Brain makes the assistant autonomous, efficient, and intelligent.")
    print()


if __name__ == "__main__":
    main()
