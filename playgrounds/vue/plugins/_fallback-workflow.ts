import type { WorkflowGraphWorkflow } from '@cloudflare-graph/vue'

export const fallbackWorkflow: WorkflowGraphWorkflow = {
  class_name: 'demo-workflow',
  functions: {},
  nodes: [
    {
      config: {
        retries: {
          backoff: 'exponential',
          delay: '5 seconds',
          limit: 3,
        },
        timeout: '2 minutes',
      },
      name: 'collect-input',
      nodes: [],
      type: 'step_do',
    },
    {
      branches: [
        {
          condition: 'payload.priority === "high"',
          nodes: [
            {
              config: {
                retries: {
                  backoff: 'linear',
                  delay: '10 seconds',
                  limit: 2,
                },
                timeout: '5 minutes',
              },
              name: 'page-oncall',
              nodes: [],
              type: 'step_do',
            },
          ],
        },
        {
          condition: '',
          nodes: [
            {
              duration: '30 seconds',
              name: 'cooldown',
              type: 'step_sleep',
            },
          ],
        },
      ],
      type: 'if',
    },
    {
      kind: 'all',
      nodes: [
        {
          nodes: [
            {
              config: {
                retries: {
                  backoff: 'constant',
                  delay: 0,
                  limit: 0,
                },
                timeout: '3 minutes',
              },
              name: 'write-audit-log',
              nodes: [],
              type: 'step_do',
            },
          ],
          type: 'block',
        },
        {
          nodes: [
            {
              config: {
                retries: {
                  backoff: 'constant',
                  delay: 0,
                  limit: 0,
                },
                timeout: '3 minutes',
              },
              name: 'notify-slack',
              nodes: [],
              type: 'step_do',
            },
          ],
          type: 'block',
        },
      ],
      type: 'parallel',
    },
    {
      catch_block: {
        nodes: [
          {
            config: {
              retries: {
                backoff: 'constant',
                delay: 0,
                limit: 0,
              },
              timeout: '1 minute',
            },
            name: 'capture-failure',
            nodes: [],
            type: 'step_do',
          },
        ],
        type: 'block',
      },
      finally_block: {
        nodes: [
          {
            config: {
              retries: {
                backoff: 'constant',
                delay: 0,
                limit: 0,
              },
              timeout: '1 minute',
            },
            name: 'cleanup-artifacts',
            nodes: [],
            type: 'step_do',
          },
        ],
        type: 'block',
      },
      try_block: {
        nodes: [
          {
            config: {
              retries: {
                backoff: 'exponential',
                delay: '15 seconds',
                limit: 3,
              },
              timeout: '10 minutes',
            },
            name: 'deploy-release',
            nodes: [],
            type: 'step_do',
          },
        ],
        type: 'block',
      },
      type: 'try',
    },
  ],
  payload: {
    fields: {
      priority: {
        type: 'unknown',
      },
    },
    type: 'object',
  },
}
